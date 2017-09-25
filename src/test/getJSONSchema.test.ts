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
  });
});
