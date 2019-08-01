const halloweenCostumeIdeas: any = ['😱 ', '👹', '🤖', '👻', '👽'];

/**
 * The following is valid TypeScript, because `any` can be assigned any type,
 * even types that will result in runtime errors
 */
halloweenCostumeIdeas.a.b.c.d;
halloweenCostumeIdeas();

interface Comment {
  date: Date;
  message: string;
}

/**
 * DataServiceAny
 *
 * A service that will return data in some unknown way
 */
interface DataServiceAny {
  getData(): any;
}

let serviceAny: DataServiceAny;
const resultAny = serviceAny.getData();

/**
 * Valid TypeScript because getData() returns a type of any
 */
resultAny.a.b.c.d;

/**
 * by checking what type the result is, we can then safely call functions for
 * that type
 *
 * The problem with this is that between the time when a result is returned and
 * this check, another dev may attempt to access properties that don't exist on
 * the result, e.g.:
 *
 * resultAny.a.b.c.d
 *
 * This can be addressed by instead defining the return value as `unknown`,
 * preventing property accessors from being used without first type-checking the
 * object
 */
if (typeof resultAny === 'string') {
  console.log(resultAny.toUpperCase());
}

interface DataServiceUnknown {
  getData(): unknown;
}

let serviceUnknown: DataServiceUnknown;
const resultUnknown = serviceUnknown.getData();

/**
 * THe following is now invalid in TypeScript, because there is no type-checking
 */
// resultUnknown.a.b.c.d;

/**
 * Valid TypeScript for `unknown` because we've performed type-checking
 */
if (typeof resultUnknown === 'string') {
  console.log(resultUnknown.toUpperCase());
}
