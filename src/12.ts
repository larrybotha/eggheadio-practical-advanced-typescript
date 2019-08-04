/**
 * We want a type that flattens array types, and returns all the types contained
 * in that array
 *
 * It should also work not only on arrays, but on objects, and primitives
 */
const numbers = [1, 2];

const someObj = {
  id: 21,
  name: 'Sam',
};

const someBoolean = true;

/**
 * We can create multiple types that handle arrays of numbers, generic objects,
 * and booleans
 */
type FlattenArray<T extends any[]> = T[number];
type FlattenObject<T extends object> = T[keyof T]; // extract types of the keys from T
type FlattenBoolean = any;

/**
 * But the above can be merged into a single type using conditional types
 */
type Flatten<T> = T extends any[]
  ? T[number]
  : T extends object
  ? T[keyof T]
  : T;

type NumbersArrayFlattened = Flatten<typeof numbers>; // number
type SomeObjectFlattened = Flatten<typeof someObj>; // number | string
type SomeBooleanFlattened = Flatten<typeof someBoolean>; // true
