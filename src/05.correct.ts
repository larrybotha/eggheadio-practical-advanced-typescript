/**
 * Actions
 */
interface Action {
  type: string;
}

class Add implements Action {
  /**
   * 'Add' is unique here - if we define it as a string, TypeScript only knows
   * it as a string.
   *
   * If, however, we remove the `string` type, TypeScript now interprets it as a
   * string literal type - the type _must_ be 'Add', and can be no other string
   *
   * This property is called the discriminant if its name, type, and
   * readonly-ness are shared by other interfaces in a union type
   */
  readonly type = 'Add';
  constructor(public payload: string) {}
}

class RemoveAll implements Action {
  readonly type = 'Remove All';
}

class RemoveOne implements Action {
  readonly type = 'Remove One';
  constructor(public payload: number) {}
}

/**
 * Because our reducer can accept one of many types of action, we need to create
 * a union of those actions that we can specify in the reducer's signature
 *
 * This is called a discriminated union, because every interface has a shared
 * property that can be used to infer which object is being used elswhere in the
 * app
 */
type TodoActions = Add | RemoveAll | RemoveOne;

/**
 * Reducer
 */
interface ITodoState {
  todos: string[];
}

function todoReducer(
  action: TodoActions,
  state: ITodoState = {todos: []}
): ITodoState {
  switch (action.type) {
    case 'Add': {
      return {
        todos: [...state.todos, action.payload],
      };
    }

    case 'Remove All': {
      return {
        todos: [],
      };
    }

    case 'Remove One': {
      return {
        todos: state.todos.slice().splice(action.payload, 1),
      };
    }

    /**
     * Because we now have a union type indicating the actions this reducer may
     * receive, if any of the case statements are commented out, we get a type
     * error here indicating that we've missed something
     */
    default: {
      /**
       * The `never` type indicates:
       *
       *    this value will never occur
       *
       * which is what we want, since the only actions that should be processed
       * here are ones that are defined in the union type
       *
       * This is a compile-time check to ensure we always handle all of the
       * actions
       */
      const x: never = action;
    }
  }
  return state;
}
