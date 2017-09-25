import 'mocha';
import 'reflect-metadata';
import { expect } from 'chai';

import { MetadataKeys } from '../enums';
import { property, arrayProperty, objectOptions } from '../decorators';

describe('decorators', () => {
  describe('property', () => {
    it('Should throw PropertyHasInvalidTypeError if property is an array', () => {
      try {
        class Schema {
          @property({ required: true })
          prop: string[];
        }
      } catch (err) {
        expect(err.message).to.equal('Property: prop of Schema cannot have type: array.');
      }
    });

    it('Should not throw PropertyHasInvalidTypeError if property has valid type', () => {
      class Schema {
        @property({ required: true })
        prop: string;
      }
    });
  });
  describe('arrayProperty', () => {
    it('Should throw PropertyIsNotArrayError if arrayProperty is not array', () => {
      try {
        class Schema {
          @arrayProperty({ items: String })
          arrayProp: string;
        }
      } catch (err) {
        expect(err.message).to.equal('Property: arrayProp of Schema is not an array.');
      }
    });

    it('Should not throw PropertyIsNotArrayError if arrayProperty is an array', () => {
      class Schema {
        @arrayProperty({ items: String })
        propArray: string[];
      }
    });
  });
  describe('objectOptions', () => {
    it('Should set object options for schema', () => {
      const options = { additionalProperties: false };

      class Schema {
        prop: string;
      }
      objectOptions(options)(Schema);

      const metadata = Reflect.getMetadata(MetadataKeys.OPTIONS, Schema.prototype);

      expect(metadata).to.equal(options);
    });
  });
});
