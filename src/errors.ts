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

export class PropertyHasInvalidTypeError extends Error {
  constructor(target: any, key: string, typeName: string) {
    super(`Property: ${key} of ${target.constructor.name} cannot have type: ${typeName}.`);
  }
}

export class EnumEmptyError extends Error {
  constructor() {
    super('Enum has no values.');
  }
}
