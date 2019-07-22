/**
 * Actions
 */
interface Action {
  type: string;
  /**
   * [1] - add a generic to fix `payload` throwing compile errors
   */
  // payload?: any;
}

class Add implements Action {
  /**
   * We are defining the type as string - TypeScript can't infer anything more
   * than this from the type, so it won't be able to provide value later in
   * terms of hints and compilation errors without us having to add bloated
   * code.
   *
   * Instead, we can drop the `string` type, resulting in a `string literal`
   * type - TypeScript will know that not only must the type be a string, but
   * that it can only be the string provided here
   *
   * Important to note - if `readonly` is removed, the type will revert to being
   * a generic string
   *
   * This is because without the readonly property TypeScript can't be sure that
   * the property won't be modified later on.
   */
  readonly type: string = 'Add';
  constructor(public payload: string) {}
}

class RemoveAll implements Action {
  readonly type: string = 'Remove All';
}

/**
 * Reducer
 */

interface ITodoState {
  todos: string[];
}

function todoReducer(
  action: Action,
  state: ITodoState = {todos: []}
): ITodoState {
  switch (action.type) {
    case 'Add': {
      /**
       * [2] cast the action to have the interface we want it to use
       *
       * By casting the action to the Add interface, we make the statement
       * type-safe, but we add bloat. Additionally, we are casting the Add
       * action as an Add action within its own case statement - this is
       * redundant
       */
      // const payload = (<Add>action).payload;

      return {
        /**
         * we have a TS error here because we are trying to access a property on
         * `action` that we haven't added to any type definition.
         *
         * To fix this we could:
         *
         * 1. add a generic property to Action, such as:
         *    payload?: any
         *
         *    This isn't type-safe, as if we are expecting a string here, we'll
         *    have no way of verifying it
         *
         * 2. cast payload to a string using (<Add>action).payload
         *
         *    This is type-safe, but with the drawback that we'd have to do this
         *    with every property in every case clause
         *
         * 3. We know that each action has a unique string for its type
         *    property. TypeScript has a string literal property that we can
         *    leverage here - instead of defining the actions' `type` as a string,
         *    we simply remove the type, resulting in a string literal as `type`s
         *    type
         *
         *    The string literal only works in this situation when the property
         *    is marked as readonly, otherwise TypeScript doesn't have a
         *    guarantee that the value won't change at some point in time.
         *
         *    Additionally, we can't simply define `Action` as the type of the
         *    action that this reducer will accept, because it may be one of
         *    many actions that inherit from the base Action interface. To
         *    address this, we need a union type that defines all the possible
         *    actions our reducer may receive
         */
        todos: [...state.todos, action.payload],
      };
    }

    case 'Remove All': {
      return {
        todos: [],
      };
    }

    default: {
      const x: never = action;
    }
  }
  return state;
}
