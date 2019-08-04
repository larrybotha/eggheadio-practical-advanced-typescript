interface StringContainer {
  value: string;
  format(): string;
  split(): string[];
}

interface NumberContainer {
  value: number;
  nearestPrime: number;
  round(): number;
}

/**
 * ItemWithAnyContainer
 *
 * A generic that accepts any type, and the resulting container can be of any type
 */
type ItemWithAnyContainer<T> = {
  id: T;
  container: any;
};

/**
 * Because our container is of type any, we don't get any hints or typechecking
 * on it
 */
let itemAny: ItemWithAnyContainer<string> = {
  id: 'asd',
  container: null,
};

/**
 * ItemWithConditionalContainer
 *
 * We can improve on the above by specifiying conditional types
 *
 * TypeScript allows for use of ternary operators to evalute the type in a generic.
 *
 * Using `extends` we can evaluate the generic, and assign a type based on the
 * result.
 */
type ItemWithConditionalContainer<T> = {
  id: T;
  container: T extends string ? StringContainer : NumberContainer;
};

/**
 * Because we've now got a conditional type, we get type hinting on the container
 * property here:
 *
 * itemString.container.<value|split|format>
 */
let itemString: ItemWithConditionalContainer<string> = {
  id: 'asd',
  container: null,
};

/**
 * and the same here:
 * itemNumber.container.<value|nearestPrime|round>
 */
let itemNumber: ItemWithConditionalContainer<number> = {
  id: 1,
  container: null,
};
