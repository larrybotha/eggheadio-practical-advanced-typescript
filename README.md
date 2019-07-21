# Egghead.io - Practical Advanced Typescript

Exercises and annotations for Egghead.io's [Practical Advanced TypeScript](https://egghead.io/courses/practical-advanced-typescript) course.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [2. Improve Readability with TypeScript Numeric Separators when working with Large Numbers](#2-improve-readability-with-typescript-numeric-separators-when-working-with-large-numbers)

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
