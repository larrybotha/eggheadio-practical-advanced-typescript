# Egghead.io - Practical Advanced Typescript

Exercises and annotations for Egghead.io's [Practical Advanced TypeScript](https://egghead.io/courses/practical-advanced-typescript) course.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [02. Improve Readability with TypeScript Numeric Separators when working with Large Numbers](#02-improve-readability-with-typescript-numeric-separators-when-working-with-large-numbers)
- [03. Make TypeScript Class Usage Safer with Strict Property Initialization](#03-make-typescript-class-usage-safer-with-strict-property-initialization)
- [04. Use the JavaScript “in” operator for automatic type inference in TypeScript](#04-use-the-javascript-in-operator-for-automatic-type-inference-in-typescript)
- [05. Automatically infer TypeScript types in switch statements](#05-automatically-infer-typescript-types-in-switch-statements)
- [06. Create Explicit and Readable Type Declarations with TypeScript mapped Type Modifiers](#06-create-explicit-and-readable-type-declarations-with-typescript-mapped-type-modifiers)
- [07. Use Types vs. Interfaces](#07-use-types-vs-interfaces)
- [08. Build self-referencing type aliases in TypeScript](#08-build-self-referencing-type-aliases-in-typescript)
- [09. Simplify iteration of custom data structures in TypeScript with iterators](#09-simplify-iteration-of-custom-data-structures-in-typescript-with-iterators)
- [10. Use the TypeScript "unknown" type to avoid runtime errors](#10-use-the-typescript-unknown-type-to-avoid-runtime-errors)
- [11. Dynamically Allocate Function Types with Conditional Types in TypeScript](#11-dynamically-allocate-function-types-with-conditional-types-in-typescript)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 02. Improve Readability with TypeScript Numeric Separators when working with Large Numbers

[02.ts](src/02.ts)

```
$ node build/02.js
```

- long numbers are difficult to read
- TypeScript allows one to make numbers more readable by separating digits with
    underscores

```typescript
const longNumber = 1111111111111111.111_111
const longNumberReadable = 1_111_111_111_111_111.111_111
```

## 03. Make TypeScript Class Usage Safer with Strict Property Initialization

[03.ts](src/03.ts)

```
$ node build/03.js
```

In a class instance, we may attempt to process an object which is `undefined`:

```typescript
class MyClass {
  // may be an array or undefined
  xs: string[];

  constructor() {}
}

const inst = new MyClass()

// compile error, but not TS error
inst.xs.filter(...)
```

To ensure that TypeScript picks up that we have an unsafe class property, we
need the following in `tsconfig.json`:

```json
...
  compilerOptions: {
    ...
    "strictPropertyInitialization": true,
    "strictNullChecks": true,
    ...
  }
...
```

`strictPropertyInitialization` prevents one from cretaing unsage properties in
classes.

To address the unsafety we have a few options:

- allow `undefined` as a type on the property; requires guards all over our code
- initialise the property where it is defined
- initialise the property inside the constructor
- use TypeScript's definite assignment operator (`!`) to indicate that a value will be
    provided to the class when instantiated

  ```typescript
  class MyClass {
    // we will definitely have an array to operate on, here, although now we
    // can still experience runtime errors, but we don't require guards in
    // order for for tsc to compile
    definiteProperty!: string[]
  }
  ```

## 04. Use the JavaScript “in” operator for automatic type inference in TypeScript

[04.ts](src/04.ts)

```
$ node build/04.js
```

When dealing with union types, we have a few strategies for control flow
statements:

1. assume an object is the object we want to deal with:

  ```typescript
  function myFunc(obj: Interface1 | Interface2) {
    // assume we've been given an Interface1 object
    if (<Interface1>obj.interface1Prop) {
      // ...
    } else {
      // ...
    }
  }
  ```

  The problem with this is that TypeScript will throw an error if
  `interface1Prop` doesn't exist on `Interface2`.

2. use a guard

  ```typescript
  function myFunc(obj: Interface1 | Interface2) {
    /**
     * We're guaranteed an Interface1 object if the predicate returns true now
     */
    if (objectIsInterface1(obj)) {
      // ...
    } else {
      // ...
    }
  }

  function objectIsInterface1(obj: Interface1 | Interface1): obj is Interface1 {
    // use the assumption here, instead
    return (<Interface1>obj).interface1Prop !== undefined;
  }
  ```

  but this can quickly become cumbersome

3. use the `in` operator to infer the type of the object

  ```typescript
  function myFunc(obj: Interface1 | Interface2) {
    if ("interface1Prop" in obj) {
      // ...
    } else {
      // ...
    }
  }
  ```

  Inside the first block TypeScript will hint the correct properties for that
  object, while in the second block only the properties for that object will be
  hinted.

## 05. Automatically infer TypeScript types in switch statements

[05.incorrect.ts](src/05.incorrect.ts)

[05.correct.ts](src/05.correct.ts)

```
$ node build/05.correct.js
```

In the following example:

```typescript
interface Action {
  type: string;
}

interface A implements Action {
  readonly type: string = 'A';
  someProp: string;
}

interface B implements Action {
  readonly type: string = 'B';
}

const reducer = (state: State, action: Action) {
  switch(action.type) {
    case 'A': {
      return {...state, someProp: action.someProp}
    }
  }
}
```

we'd get a type error because `someProp` is not defined on `Action`. To fix
this:

1. fix `A` and `B`s interfaces by removing `string` from `type`

  This has the effect of making `type` a string-literal type. In addition to
  being a string-literal type, the `readonly` operator indicates to TypeScript
  that we have a value that won't change in future. We have guaranteed to
  TypeScript that the value of `type` in our actions won't change.

  If `readonly` were removed, that guarantee would be lost, and TypeScript would
  again be unable to assist us in properly type-checking the `type` of each
  action.
2. create a union of all the actions, and set the `action` in the reducer's type
   declaration to that union so that TypeScript knows the reducer will be
   receiving one of those actions as a type

   This is called a discriminated union because each interface shares a common
   property from which TypeScript can infer the type of an object
3. add a `default` case that assigns the value of action to a variable with a
   type of `never`

   This indicates to TypeScript that this case should never happen, and thus
   indicates to us if we have omitted an action in our cases

   The `default` case has no purpose for the runtime - it's a compile-time check
   to ensure we're handling all cases

i.e.

```typescript
interface Action {
  type: string;
}

interface A implements Action {
  // no `type` provided for type property - we now have a unique string literal
  readonly type = 'A';
  someProp: string;
}

interface B implements Action {
  // and here
  readonly type = 'B';
}

// create the union type
type MyActions = A | B;

// use the union type in the reducer's type definition
const reducer = (state: State, action: MyActions) {
  switch(action.type) {
    case 'A': {
      return {...state, someProp: action.someProp}
    }

    // ...

    default: {
      // indicate to the compiler that we should never get here
      const x: never = action;
    }
  }
}
```

To create a discriminated union:

1. create 2 or more types that share a property with the same name, type, and is
   `readonly`

    This property is called the _discriminant_.

2. create a union type containing all of those types

## 06. Create Explicit and Readable Type Declarations with TypeScript mapped Type Modifiers

[06.ts](src/06.ts)

```
$ node build/06.js
```

Using mapped types we can:

- add properties to types
- add types to existing properties
- remove properties from types
- apply bulk changes to types

```typescript
interface Person {
  name: string;
  age: number;
  favoriteColor?: string;
}

/**
 * Mark every property in Person as readonly
 */
type PersonReadonly = {
  +readonly [K in keyof Person]: Person[k];
}

/**
 * Remove the optional flag from all properties
 */
type PersonNoOptionals = {
  [K in keyof Person]-?: Person[k];
}

/**
 * Allow string for all properties
 */
type PersonNoOptionals = {
  [K in keyof Person]: Person[k] | string;
}
```

To use type modifiers:

- use the `type` keyword to create a new type, adding the modifier to the body
    of the declaration

## 07. Use Types vs. Interfaces

[07.ts](src/07.ts)

```
$ node build/07.js
```

- types are generally used to describe complex objects
- interfaces are generally used in a more object-oriented fashion to describe
    the shape of objects
- two objects that are assigned a type and interface with the same structure can
    be assigned to one another because TypeScript uses structural typing
- the following are equivalent:

  ```typescript
  interface FnInterface {
    (str: string): void
  }
  type FnType = (str: string) => void

  interface ListInterface {
    [key: number]: string;
  }
  type ListType = string[]
  ```

  The list interface, however, will not benefit from hinting array functions /
  typechecking
- a `type` can merge both `interface`s and `type`s, as can an `interface`
- TypeScript will merge the properties of interfaces with the same names:

  ```typescript
  interface Foo {
    a: string;
  }
  interface Foo {
    b: string;
  }
  /**
   * foo has properties a and b
   */
  let foo: Foo;
  ```

  This is useful for extending libraries without changing the source, while
  maintaining type-strictness:

  ```typescript
  interface JQuery {
    myFunc(): JQuery
  }

  // this will typecheck
  $(this).myFunc(...)
  ```

  One caveat: this is only possible if the library is authored as an interface.
  Make sure to author your libraries' public APIs as interfaces to allow others
  to extend them

## 08. Build self-referencing type aliases in TypeScript

[08.ts](src/08.ts)

```
$ node build/08.js
```

- interfaces can be self-referencing:

  ```typescript
  interface TreeNode<T> {
    value: T;
    left?: TreeNode<T>;
    right?: TreeNode<T>;
  }
  ```

  This allows one to continue traversing an item with valid type checking:

  ```typescript
  let node: TreeNode<string> = {value: 'foo'}

  /**
   * unsafe, but valid TypeScript
   */
  node.left.left.left.value;
  ```

## 09. Simplify iteration of custom data structures in TypeScript with iterators

[09.ts](src/09.ts)

```
$ node build/09.js
```

One can create their own iterable object by implementing `IterableIterator`.

Iterators are not specific to TypeScript; they are a concept built into
Javascript, and used in arrays, Symbols, Maps, Generators, etc.

## 10. Use the TypeScript "unknown" type to avoid runtime errors

[10.ts](src/10.ts)

```
$ node build/10.js
```

- `any` is the most relaxed type in TypeScript
- one can assign any type to a value with type `any`
- one can access any property on a type declared as `any`

  e.g.

  ```typescript
  const obj: any = '';

  // valid
  obj.a.b.c.d
  // or
  obj()
  ```

The above demonstrates the problem with `any`; any user can access any property
or even execute a value declared with `any`, which will present itself as a
runtime error, but not a TypeScript error.

An area where this can be problematic is when retrieving data from an API; is
the result of one type, or another? By setting the type to `any` for the result,
we have no confidence in what properties may be requested on the result.

To address this, one can use the `unknown` type. `unknown` prevents accessing
properties on an object without first type-checking the value:

```typescript
const objAny: any = 'foo';

// valid TypeScript
objAny.a.b.c.d

const objUnknown: unknown = 'bar';

// invalid TypeScript
objUnknown.a

// valid TypeScript
if (objUnknown.hasOwnProperty('a')) {
  console.log(objUnknown.a)
}
```

## 11. Dynamically Allocate Function Types with Conditional Types in TypeScript

[11.ts](src/11.ts)

```
$ node build/11.js
```

One can conditionally assign types to properties using ternary operators:

```typescript
interface GenericWithAny<T> {
  value: T;
  someProp: any;
}

/**
 * no type hinting / checking on itemAny.someProp
 */
const itemAny: GenericWithAny<string> = {
  value: 'foo',
  someProp: null;
}

interface GenericWithConditional<T> {
  value: T;
  someProp: T extends string ? Array : number;
}

/**
 * We know that someProp must be an array, and we get all the associated hinting
 * and tpyechecking now
 */
const item1: GenericWithConditional<string> = {
  value: 'bar',
  someProp: null,
}
```
