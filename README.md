# Egghead.io - Practical Advanced Typescript

Exercises and annotations for Egghead.io's [Practical Advanced TypeScript](https://egghead.io/courses/practical-advanced-typescript) course.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [02. Improve Readability with TypeScript Numeric Separators when working with Large Numbers](#02-improve-readability-with-typescript-numeric-separators-when-working-with-large-numbers)
- [03. Make TypeScript Class Usage Safer with Strict Property Initialization](#03-make-typescript-class-usage-safer-with-strict-property-initialization)
- [04. Use the JavaScript “in” operator for automatic type inference in TypeScript](#04-use-the-javascript-in-operator-for-automatic-type-inference-in-typescript)
- [05. Automatically infer TypeScript types in switch statements](#05-automatically-infer-typescript-types-in-switch-statements)

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

[05.ts](src/05.ts)

```
$ node build/05.js
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
