class Library {
  /**
   * without strictPropertyInitialization this is unsafe to perform array
   * operations on
   *
   * Once we've added strictPropertyInitialization, as well as strictNullChecks
   * (so that we ensure that we account for null and undefined), we have a few
   * options:
   *
   * - create a union type with undefined; draweback is that it's the
   * call-site's responsibility to guard against falsy values
   * - initialise the value here
   * - initialise the value inside the constructor
   * - use TypeScript's ! (definiteness operator) if we know that we will be
   * provided a value when instantiated
   */
  // titlesUnsafe: string[];
  titlesInitialized: string[] = [];
  titlesDefinite!: string[];

  constructor() {
    /**
     * initialise in constructor
     */
    this.titlesInitialized = [];
  }
}

const lib = new Library();

// const unsafeTitles = lib.unsafeTitles.filter(t => t.length < 5);
