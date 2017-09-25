import 'mocha';
import { expect } from 'chai';

import { property, arrayProperty, objectOptions } from '../decorators';
import { getJSONSchema } from '../utils';

describe('utils', () => {
  describe('getJSONSchema', () => {
    it('Should get object with property string', () => {
      class Schema {
        @property({ required: true })
        str: string;
      }

      const schema = getJSONSchema(Schema);

      expect(schema).to.eql({
        type: 'object',
        required: ['str'],
        properties: {
          str: {
            type: 'string',
          },
        },
      });
    });

    it('Should get object with property number', () => {
      class Schema {
        @property()
        number: number;
      }

      const schema = getJSONSchema(Schema);

      expect(schema).to.eql({
        type: 'object',
        properties: {
          number: {
            type: 'number',
          },
        },
      });
    });

    it('Should get object with property number and its options', () => {
      class Schema {
        @property({ maximum: 3, minimum: 2 })
        number: number;
      }

      const schema = getJSONSchema(Schema);

      expect(schema).to.eql({
        type: 'object',
        properties: {
          number: {
            maximum: 3,
            minimum: 2,
            type: 'number',
          },
        },
      });
    });

    it('Should get object with property string and its options', () => {
      class Schema {
        @property({ maxLength: 3, minLength: 2, format: 'ipv4' })
        string: string;
      }

      const schema = getJSONSchema(Schema);

      expect(schema).to.eql({
        type: 'object',
        properties: {
          string: {
            minLength: 2,
            maxLength: 3,
            format: 'ipv4',
            type: 'string',
          },
        },
      });
    });

    it('Should throw error if object has no properties', () => {
      @objectOptions({ $async: true, additionalProperties: true })
      class Schema {
      }

      try {
        getJSONSchema(Schema);
      } catch (err) {
        expect(err.message).to.equal('No schema properties found on class.');
      }
    });

    it('Should get object with its options set', () => {
      @objectOptions({ $async: true, additionalProperties: true })
      class Schema {
        @property({ required: true })
        number: number;
      }

      const schema = getJSONSchema(Schema);

      expect(schema).to.eql({
        type: 'object',
        $async: true,
        additionalProperties: true,
        required: ['number'],
        properties: {
          number: {
            type: 'number',
          },
        },
      });
    });

    it('Should get object with property boolean', () => {
      class Schema {
        @property()
        bool: boolean;
      }

      const schema = getJSONSchema(Schema);

      expect(schema).to.eql({
        type: 'object',
        properties: {
          bool: {
            type: 'boolean',
          },
        },
      });
    });

    it('Should get object with mixed enum property', () => {
      class Schema {
        @property({ enum: ['str', null] })
        mixed: null | string;
      }

      const schema = getJSONSchema(Schema);

      expect(schema).to.eql({
        type: 'object',
        properties: {
          mixed: {
            enum: ['str', null],
          },
        },
      });
    });

    it('Should get object with ts enum property (string based)', () => {
      enum E {
        key = 'value',
      }
      class Schema {
        @property({ enum: E })
        enum: E;
      }

      const schema = getJSONSchema(Schema);

      expect(schema).to.eql({
        type: 'object',
        properties: {
          enum: {
            type: 'string',
            enum: ['value'],
          },
        },
      });
    });

    it('Should get object with ts enum property (number based)', () => {
      enum E {
        key = 4,
      }
      class Schema {
        @property({ enum: E })
        enum: E;
      }

      const schema = getJSONSchema(Schema);

      expect(schema).to.eql({
        type: 'object',
        properties: {
          enum: {
            type: 'number',
            enum: [4],
          },
        },
      });
    });

    it('Should get object with array enum property', () => {
      class Schema {
        @property({ enum: ['value'] })
        enum: 'value';
      }

      const schema = getJSONSchema(Schema);

      expect(schema).to.eql({
        type: 'object',
        properties: {
          enum: {
            type: 'string',
            enum: ['value'],
          },
        },
      });
    });

    it('Should get object with array property', () => {
      class Schema {
        @arrayProperty({ items: String })
        arr: string[];
      }

      const schema = getJSONSchema(Schema);

      expect(schema).to.eql({
        type: 'object',
        properties: {
          arr: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      });
    });

    it('Should get object with array property and array options', () => {
      class Schema {
        @arrayProperty({ items: Number, minItems: 2, maxItems: 3 })
        arr: number[];
      }

      const schema = getJSONSchema(Schema);

      expect(schema).to.eql({
        type: 'object',
        properties: {
          arr: {
            type: 'array',
            minItems: 2,
            maxItems: 3,
            items: {
              type: 'number',
            },
          },
        },
      });
    });

    it('Should get object with array property and item options', () => {
      class Schema {
        @arrayProperty({ items: Number, itemOptions: { minimum: 2, enum: [0, 1] } })
        arr: number[];
      }

      const schema = getJSONSchema(Schema);

      expect(schema).to.eql({
        type: 'object',
        properties: {
          arr: {
            type: 'array',
            items: {
              type: 'number',
              minimum: 2,
              enum: [0, 1],
            },
          },
        },
      });
    });

    it('Should get object with array property and item options', () => {
      enum StrEnum {
        key = 'value',
      }
      class Schema {
        @arrayProperty({ items: String, itemOptions: { minLength: 2, enum: StrEnum } })
        arr: StrEnum[];
      }

      const schema = getJSONSchema(Schema);

      expect(schema).to.eql({
        type: 'object',
        properties: {
          arr: {
            type: 'array',
            items: {
              type: 'string',
              minLength: 2,
              enum: ['value'],
            },
          },
        },
      });
    });

    it('Should get object with nested object and its options', () => {
      @objectOptions({ additionalProperties: true })
      class SubSchema {
        @property({ required: true })
        prop: string;
      }
      class Schema {
        @property({ required: true })
        sub: SubSchema;
      }

      const schema = getJSONSchema(Schema);

      expect(schema).to.eql({
        type: 'object',
        properties: {
          sub: {
            type: 'object',
            additionalProperties: true,
            properties: {
              prop: {
                type: 'string',
              },
            },
            required: ['prop'],
          },
        },
        required: ['sub'],
      });
    });

    it('Should get object with nested array of objects and their options', () => {
      @objectOptions({ additionalProperties: true })
      class SubSchema {
        @property({ required: true })
        prop: string;
      }
      class Schema {
        @arrayProperty({ required: true, items: SubSchema })
        subs: SubSchema[];
      }

      const schema = getJSONSchema(Schema);

      expect(schema).to.eql({
        type: 'object',
        properties: {
          subs: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: true,
              properties: {
                prop: {
                  type: 'string',
                },
              },
              required: ['prop'],
            },
          },
        },
        required: ['subs'],
      });
    });
  });
});
