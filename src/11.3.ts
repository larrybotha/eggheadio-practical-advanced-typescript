interface Book {
  id: string;
  tableOfContents: string[];
}

interface Tv {
  id: number;
  diagonal: number;
}

/**
 * An interface for an object that has a getter that either returns a Book or
 * a Tv type
 *
 * We have no idea what type will be returned here, however, so no typechecking,
 * and no type safety
 */
interface ItemServiceNaive {
  getItem<T>(id: T): Book | Tv;
}

/**
 * We can overload the function, and it works, but it's verbose.
 */
interface ItemServiceOverloaded {
  getItem(id: string): Book;
  getItem(id: number): Tv;
  getItem<T>(id: T): Book | Tv;
}

/**
 * This can be improved by using a conditional type which evaluates the type
 * of the value passed into the function to determine the type that's returned
 *
 * This is much better, however if we don't pass in a string, we'll expect a Tv
 * type, but we know that a Tv type expects id to be of type number
 */
interface ItemServiceConditional {
  getItem<T>(id: T): T extends string ? Book : Tv;
}

let itemServiceC: ItemServiceConditional;
const bookC = itemServiceC.getItem('10');
const tvC = itemServiceC.getItem(5);
const tvCInvalid = itemServiceC.getItem(true);

/**
 * To fix the final limitation above, we can specify a union type that we expect
 * the generic to extend in order to typecheck values passed into `getItem`
 *
 * If anything other than a string or number is passed in, we'll get a compiler
 * error
 */
interface ItemServiceConditionalStrict {
  getItem<T extends string | number>(id: T): T extends string ? Book : Tv;
}
