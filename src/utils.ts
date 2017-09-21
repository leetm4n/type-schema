import * as _ from 'lodash';

import { Schema } from './schema';
import { PropertyTypes } from './enums';
import { IItemOptions, ISchemaAnnotated, IArrayPropertyOptions, IProperyOptions } from './typings';
import { InvalidPropertyError, NoSchemaPropertiesError, InvalidTypeError } from './errors';

export const getType = (type: any) => {
  if (_.includes([Number, String, Boolean, Date], type)) {
    return _.lowerCase(type.name);
  } else if (new type() instanceof Schema) {
    return PropertyTypes.OBJECT;
  } else {
    throw new InvalidTypeError();
  }
};

export const checkOptions = (type: any, options?: IItemOptions) => {
  if (options) {
    if ((options.minimum || options.maximum) && getType(type) !== PropertyTypes.NUMBER) {
      throw new InvalidPropertyError('Only number properties can have minimum, maximum set');
    }

    if ((options.maxLength || options.minLength || options.format) && getType(type) !== PropertyTypes.STRING) {
      throw new InvalidPropertyError('Only string properties can have maxLength, minLength, format set');
    }
  }
};

export function getJSONSchema(schemaClass: { new(): Schema }) {
  const schema = new schemaClass();
  const { properties, options } = (schema as ISchemaAnnotated);

  if (!properties) {
    throw new NoSchemaPropertiesError();
  }

  const props = _.reduce(
    properties,
    (state, property) => {
      let propertyToAdd = {};

      const required = _.get(property, 'options.required', false);

      if (property.array) {
        const options = property.options as IArrayPropertyOptions;

        const type = getType(options.items);

        propertyToAdd = {
          ..._.omit(options, ['required', 'items']),
        };
        if (type === PropertyTypes.OBJECT) {
          propertyToAdd = {
            ...propertyToAdd,
            type: 'array',
            items: getJSONSchema(options.items),
          };
        } else {
          propertyToAdd = {
            ...propertyToAdd,
            type: 'array',
            items: {
              type,
            },
          };
        }
      } else {
        const options = property.options as IProperyOptions;
        const type = getType(property.type);
        if (type === PropertyTypes.OBJECT) {
          propertyToAdd = getJSONSchema(property.type);
        } else {
          if (options.enum) {
            _.assign(propertyToAdd, {
              enum: _.values(options.enum),
            });
          }
          _.assign(propertyToAdd, {
            ..._.omit(options, 'required', {}),
            type,
          });
        }
      }

      return {
        ...state,
        required: required ? _.union(state.required, [property.key]) : undefined,
        properties: {
          ...state.properties,
          [property.key]: propertyToAdd,
        },
      };
    },
    {
      type: PropertyTypes.OBJECT,
      properties: {},
    } as { required?: string[], type: PropertyTypes.OBJECT, properties: object },
  );

  return {
    ...options,
    ...props,
  };
}