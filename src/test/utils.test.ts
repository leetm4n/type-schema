import 'mocha';
import { expect } from 'chai';
import 'reflect-metadata';

import { MetadataKeys } from '../enums';
import {
  checkOptions,
  setPropertyOptions,
  getPropertyOptions,
  addPropertyKey,
  getPropertyKeys,
  setObjectOptions,
  getObjectOptions,
} from '../utils';

describe('utils', () => {
  describe('checkOptions', () => {
    it('Should throw error if type: String has options.minimum set', () => {
      try {
        checkOptions(String, { minimum: 2 });
      } catch (err) {
        expect(err.message).to.equal('Only number properties can have minimum, maximum set');
      }
    });

    it('Should throw error if type: String has options.maximum set', () => {
      try {
        checkOptions(String, { maximum: 2 });
      } catch (err) {
        expect(err.message).to.equal('Only number properties can have minimum, maximum set');
      }
    });

    it('Should throw error if type: Number has options.maxLength set', () => {
      try {
        checkOptions(Number, { maxLength: 2 });
      } catch (err) {
        expect(err.message).to.equal('Only string properties can have maxLength, minLength, format set');
      }
    });

    it('Should throw error if type: Number has options.minLength set', () => {
      try {
        checkOptions(Number, { minLength: 2 });
      } catch (err) {
        expect(err.message).to.equal('Only string properties can have maxLength, minLength, format set');
      }
    });

    it('Should throw error if type: Number has options.format set', () => {
      try {
        checkOptions(Number, { format: 'ipv4' });
      } catch (err) {
        expect(err.message).to.equal('Only string properties can have maxLength, minLength, format set');
      }
    });

    it('Should not throw error if type: Number has options.maximum and options.minimum set', () => {
      checkOptions(Number, { minimum: 2, maximum: 4 });
    });

    it('Should not throw error if type: String has options.minLength, options.maxLength and options.format set', () => {
      checkOptions(String, { minLength: 2, maxLength: 4, format: 'ipv4' });
    });
  });

  describe('setPropertyOptions', () => {
    class Schema {
      prop: string;
    }

    it('Should set property options', () => {
      const options = { array: false, type: String, options: { required: true } };
      setPropertyOptions(Schema.prototype, 'prop', options);

      const metadata = Reflect.getMetadata(MetadataKeys.OPTIONS, Schema.prototype, 'prop');
      expect(metadata).to.equal(options);
    });
  });

  describe('getPropertyOptions', () => {
    class Schema {
      prop: string;
    }

    it('Should set property options', () => {
      const metadata = { array: false, type: String, options: { required: true } };
      Reflect.defineMetadata(MetadataKeys.OPTIONS, metadata, Schema.prototype, 'prop');

      const options = getPropertyOptions(Schema, 'prop');
      expect(options).to.equal(metadata);
    });
  });

  describe('addPropertyKey', () => {
    it('Should set property key if there is none', () => {
      class Schema {
      }
      addPropertyKey('prop', Schema.prototype);

      const properties = Reflect.getMetadata(MetadataKeys.PROPERTIES, Schema.prototype);
      expect(properties).to.eql(['prop']);
    });

    it('Should set property key if there are props already set', () => {
      class Schema {
      }

      addPropertyKey('prop', Schema.prototype);
      addPropertyKey('anotherProp', Schema.prototype);

      const properties = Reflect.getMetadata(MetadataKeys.PROPERTIES, Schema.prototype);
      expect(properties).to.eql(['prop', 'anotherProp']);
    });
  });

  describe('getPropertyKeys', () => {
    it('Should get empty array if there is none', () => {
      class Schema {
      }
      const keys = getPropertyKeys(Schema);

      expect(keys).to.eql([]);
    });

    it('Should get property keys if there are props already set', () => {
      class Schema {
      }
      const props = ['prop'];
      Reflect.defineMetadata(MetadataKeys.PROPERTIES, props, Schema.prototype);

      const keys = getPropertyKeys(Schema);
      expect(keys).to.eql(['prop']);
    });
  });

  describe('setObjectOptions', () => {
    it('Should set object options', () => {
      class Schema {
      }
      const options = { additionalProperties: true };
      setObjectOptions(Schema, options);

      const metadata = Reflect.getMetadata(MetadataKeys.OPTIONS, Schema.prototype);
      expect(metadata).to.equal(options);
    });
  });

  describe('getObjectOptions', () => {
    it('Should get object options', () => {
      class Schema {
      }
      const options = { additionalProperties: true };
      Reflect.defineMetadata(MetadataKeys.OPTIONS, options, Schema.prototype);

      const metadata = getObjectOptions(Schema);
      expect(metadata).to.equal(options);
    });
  });
});
