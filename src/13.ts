/**
 * generateId
 *
 * TypeScript can infer from this function that its return type is number without
 * us having to declare it
 *
 * We get type safety without having to do any additional work
 */
function generateId(seed: number) {
  return seed + 5;
}

/**
 * If we defined a function that accepted a specific type, based on the return type
 * of another function, we'd have have to change the type of this function if the
 * implementation of the other function changed the return type
 *
 * e.g., if we changed generateId to return a string instead of a number
 *
 * We could change the type declaration here, but there's an alternative...
 */
function lookupEntity(id: number) {
  //
}

/**
 * Using TypeScript's inference, we can get the return type of a function dynamically
 *
 * We do the following:
 *
 * 1. create a type that accepts a generic type
 * 2. we specify that that type extends a function
 * 3. the function takes an arbitrary number of arguments with any types
 * 4. we attempt to infer the return type of the function
 *    1. if we can, then we return that type
 *    2. otherwise we return any
 *
 * The infer keyword works in a similar to pattern matching:
 *
 * 1. indicate to TypeScript that a type that follows this pattern will be used:
 *    (...args: any[]) => infer R
 * 2. i.e. it will be a function with an arbitrary number of arguments, and it
 *    will have some return value
 *
 * The type of the arguments may also have been inferred by using the following:
 *    T extends (...args: infer K) => infer R ? R : any;
 *
 */
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

/**
 * To use it, we pass in the typeof the function
 *
 * Now, if we change the implementation of generateId, we'll always have the
 * correct type in our lookup function's parameters
 *
 * i.e. go change generateId to return a string, and then evaluate the type of
 * the id parameter below
 */
type Id = MyReturnType<typeof generateId>;

function lookupIdentityDynamic(id: Id) {
  //
}

/**
 * In fact, TypeScript has now added support for doing this without the helper type,
 * by way of ReturnType, since 2.8
 *
 * This type is handy when using a 3rd party library that exports a function, but
 * not its return type
 */
type IdOther = ReturnType<typeof generateId>;

/**
 * One can use inference to get types of deeply nested values
 */
type UnpackPromise<T> = T extends Promise<infer K>[] ? K : any;

const xs = [Promise.resolve(true)];

/**
 * ExpectBoolean is indeed of type boolean, despite the type being nested within
 * a promise within an array
 */
type ExpectBoolean = UnpackPromise<typeof xs>;
