import * as _ from 'lodash';

import { PropertyTypes, MetadataKeys } from './enums';
import { IItemOptions, IObjectOptions, IArrayPropertyOptions, IProperyOptions, IProperty } from './typings';
import { InvalidPropertyError, NoSchemaPropertiesError, InvalidTypeError } from './errors';

export const getType = (type: any) => {
  if (_.includes([Number, String, Boolean, Date, Array], type)) {
    return _.lowerCase(type.name);
  }
  return PropertyTypes.OBJECT;
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

export const setPropertyOptions = (target: any, key: string, options: IProperty) => {
  Reflect.defineMetadata(MetadataKeys.OPTIONS, options, target, key);
};

export const getPropertyOptions = <T>(target: { new(): T }, key: string) => {
  const options = Reflect.getMetadata(MetadataKeys.OPTIONS, target.prototype, key);

  return options || {};
};

export const addPropertyKey = (key: string, target: any) => {
  const properties = Reflect.getMetadata(MetadataKeys.PROPERTIES, target) as string[] | undefined;
  if (properties) {
    properties.push(key);

    Reflect.defineMetadata(MetadataKeys.PROPERTIES, properties, target);
  } else {
    Reflect.defineMetadata(MetadataKeys.PROPERTIES, [key], target);
  }
};

export const getPropertyKeys = <T>(target: { new(): T }): string[] => {
  const properties = Reflect.getMetadata(MetadataKeys.PROPERTIES, target.prototype);

  return properties || [];
};

export const setObjectOptions = (target: any, options?: IObjectOptions) => {
  if (options) {
    Reflect.defineMetadata(MetadataKeys.OPTIONS, options, Object.getPrototypeOf(new target()));
  }
};

export const getObjectOptions = <T>(target: { new(): T }): IObjectOptions => {
  const options = Reflect.getMetadata(MetadataKeys.OPTIONS, target.prototype);

  return options || {};
};

export function getJSONSchema<T>(schemaClass: { new(): T }) {
  const [properties, options] = [getPropertyKeys(schemaClass), getObjectOptions(schemaClass)];

  if (_.isEmpty(properties)) {
    throw new NoSchemaPropertiesError();
  }

  const props = _.reduce(
    properties,
    (state, propertyKey) => {
      let propertyToAdd = {};

      const property = getPropertyOptions(schemaClass, propertyKey);

      const required = _.get(property, 'options.required', false);

      if (property.array) {
        const options = property.options as IArrayPropertyOptions;

        const type = getType(options.items);

        propertyToAdd = {
          ..._.omit(options, ['required', 'items', 'itemOptions']),
        };
        if (type === PropertyTypes.OBJECT) {
          propertyToAdd = {
            ...propertyToAdd,
            type: 'array',
            items: getJSONSchema(options.items),
          };
        } else {
          let itemOptions = {};
          if (options && options.itemOptions) {
            itemOptions = _.omit(options.itemOptions, 'enum');
            if (options.itemOptions.enum) {
              _.assign(itemOptions, {
                enum: _.values(options.itemOptions.enum),
              });
            }
          }
          propertyToAdd = {
            ...propertyToAdd,
            type: 'array',
            items: {
              ...itemOptions,
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
            ..._.omit(options, ['required', 'enum']),
            type,
          });
        }
      }

      return {
        ...state,
        required: required ? _.union(state.required, [propertyKey]) : undefined,
        properties: {
          ...state.properties,
          [propertyKey]: propertyToAdd,
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
