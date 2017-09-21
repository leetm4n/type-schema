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
  constructor() {
    super('Array properties should have items set.');
  }
}
