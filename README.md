# Egghead.io - Practical Advanced Typescript

Exercises and annotations for Egghead.io's [Practical Advanced TypeScript](https://egghead.io/courses/practical-advanced-typescript) course.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [2. Improve Readability with TypeScript Numeric Separators when working with Large Numbers](#2-improve-readability-with-typescript-numeric-separators-when-working-with-large-numbers)
- [3. Make TypeScript Class Usage Safer with Strict Property Initialization](#3-make-typescript-class-usage-safer-with-strict-property-initialization)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 2. Improve Readability with TypeScript Numeric Separators when working with Large Numbers

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

## 3. Make TypeScript Class Usage Safer with Strict Property Initialization

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
