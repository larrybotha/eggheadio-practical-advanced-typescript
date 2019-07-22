interface Pet {
  name: string;
  age: number;
  favouritePark?: string;
}

/**
 * Use mapped type modifiers to make all properties in Pet readonly
 *
 * This is useful in situations where you want something to be immutable, such
 * as in a reducer.
 *
 * Tpye modifiers make it possible to augment properties, and apply bulk changes
 * to properties
 *
 * We can indicate to users that we are adding the `readonly` flag to all
 * proeprtyies by prepending `readonly` with +
 */
type PetReadonly = {+readonly [K in keyof Pet]: Pet[K]};

/**
 * Make all properties as optional
 */
type PetOptional = {[K in keyof Pet]?: Pet[K]};

/**
 * Add string as a valid type to all proeprties
 */
type PetWithString = {[K in keyof Pet]?: Pet[K] | string};

/**
 * Remove the ootional status from all properties
 *
 * We can remove the optional flag from properties by prepending the ? sign with
 * -
 */
type PetNoOptionals = {[K in keyof Pet]-?: Pet[K]};

const pet: Pet = {name: 'Sam', age: 5};
const petReadonly: PetReadonly = {name: 'Sam', age: 5};
const petOptional: PetOptional = {name: 'Sam'};
const petWithStringAge: PetWithString = {name: 'Sam', age: '5'};
const petNoOptionals: PetNoOptionals = {
  age: 5,
  favouritePark: 'House',
  name: 'Sam',
};

pet.age = 6;
/**
 * We are unable to change the age of the readonly pet
 */
// petReadonly.age = 6;
