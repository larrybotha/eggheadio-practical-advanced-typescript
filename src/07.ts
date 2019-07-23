type PetType = {
  pose(): void;
};

interface Feline {
  nightvision: boolean;
}

interface Cat extends Feline, PetType {}

type Dog = PetType;

/**
 * type is generally used to describe more complex types
 */
type PetUnion = Dog | Cat;

/**
 * interfaces are generally used for a more object-oriented approach to defining
 * types
 */
interface AnimalInterface {
  age: number;
  eat(): void;
  speak(): string;
}

/**
 * a tyoe can be implemented in much the same way as an interface, and because
 * TypeScript uses structural typing, we can assign an object with the interface
 * declaration to an object with the type declaration without throwing any errors
 */
type AnimalTypeAlias = {
  age: number;
  eat(): void;
  speak(): string;
};

class Animal implements AnimalInterface {
  age = 0;

  eat() {
    console.log('nom nom');
  }

  speak() {
    return 'moo';
  }
}

/**
 * assign 2 different types with the same shape to each other without errors
 */
let animalInterface: AnimalInterface = new Animal();
let animalTypeAlias: AnimalTypeAlias;

animalTypeAlias = animalInterface;

/**
 * type aliasescan act as a name for more complex types, such as functions, or
 * arrays
 */
type Eat = (food: string) => void;
type AnimalList = string[];

/**
 * and we can create the equivalent of a function type using an interface, and even
 * the array type (although we lose all the array methods)
 */
interface EatInterface {
  (food: string): void;
}
interface AnimalListInterface {
  [key: number]: string;
}

/**
 * type aliases are often useful for expressing types in a more concise manner
 *
 * The following two examples are functionally the same, with the type alias being
 * more ters and readaable
 *
 * Both examples also demonstrate that we can mix types and interfaces
 */
type CatType = PetType & Feline; // vs
interface CatInterface extends PetType, Feline {}

/**
 * If we create two interfaces with the same name, and assign a value to implement
 * that interface, that value will have the conjunction of all properties from
 * both interfaces on it
 *
 * This is not possible with types
 */
interface Foo {
  a: string;
}
interface Foo {
  b: string;
}

let foo: Foo;

/**
 * Interface merging is useful for extending interfaces of other libraries without
 * affecting the library itself
 *
 * e.g. if you want to add a myHelper function to SomeLibe, and SomeLib has an
 * interface, it can be done like so:

    interface SomeLib {
      myHelper(): void;
    }
 *
 * This is only possible if a library author marks their library as an interface,
 * so it's important to do so in any libraries you write
 */
