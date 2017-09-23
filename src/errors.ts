export class InvalidTypeError extends Error {
  constructor() {
    super('Type provided is invalid.');
  }
}

export class InvalidPropertyError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NoSchemaPropertiesError extends Error {
  constructor() {
    super('No schema properties found on class.');
  }
}

export class NoItemTypeProvidedError extends Error {
  constructor(target: any, key: string) {
    super(`Property: ${key} of ${target.constructor.name} should have options.items set.`);
  }
}

export class PropertyIsNotArrayError extends Error {
  constructor(target: any, key: string) {
    super(`Property: ${key} of ${target.constructor.name} is not an array.`);
  }
}

export class PropertyIsArrayError extends Error {
  constructor(target: any, key: string) {
    super(`Property: ${key} of ${target.constructor.name} is an array.`);
  }
}
