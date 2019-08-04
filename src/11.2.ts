/**
 * Create a type that only accepts arrays
 */
type TypeArray<T> = T extends any[] ? T : never;
/**
 * Create a type that only accepts arrays of strings or numbers
 *
 * Because we passed in string and number, but the type of TypeArray only accepts
 * arrays, the resulting type for StringsOrNumbers drops the `never` types,
 * leaving only the non-never types
 *
 * This works because of the following:
 * 1. conditional types distribute over each type in a set of possible types
 *    i.e. string | number | string[] | number[] results in
 *         never  | never  | string[] | number[]
 * 2. because a `never` type can never be used, TypeScript ignores it in a union
 *    of types, resulting in:
 *    string[] | number[]
 */
type StringsOrNumbers = TypeArray<string | number | string[] | number[]>;
