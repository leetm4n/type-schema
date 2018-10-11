import * as _ from 'lodash';
import 'reflect-metadata';

import { IProperyOptions, IArrayPropertyOptions, IObjectOptions, IRawPropertyOptions } from './typings';
import { PropertyTypes, MetadataKeys } from './enums';
import { checkOptions, addPropertyKey, getType, setObjectOptions, setPropertyOptions, getEnumArray } from './utils';
import { NoItemTypeProvidedError, PropertyIsNotArrayError, PropertyHasInvalidTypeError } from './errors';

export const property = (options?: IProperyOptions) => (target: any, key: string) => {
  const type = Reflect.getMetadata(MetadataKeys.TYPE, target, key);

  const typeName = getType(type);
  const valid = _.includes(_.omit(_.values(PropertyTypes), PropertyTypes.ARRAY), typeName);
  if (!valid) {
    throw new PropertyHasInvalidTypeError(target, key, typeName);
  }

  if (options && options.enum) {
    options.enum = getEnumArray(options.enum);
  }
  checkOptions(type, options);
  addPropertyKey(key, target);

  const propertyOptions = { options, type, array: false };

  setPropertyOptions(target, key, propertyOptions);
};

export const rawProperty = (options: IRawPropertyOptions) => (target: any, key: string) => {
  addPropertyKey(key, target);

  const propertyOptions = { options, raw: true };
  setPropertyOptions(target, key, propertyOptions);
};

export const arrayProperty = (options: IArrayPropertyOptions) => (target: any, key: string) => {
  const type = Reflect.getMetadata(MetadataKeys.TYPE, target, key);

  if (getType(type) !== PropertyTypes.ARRAY) {
    throw new PropertyIsNotArrayError(target, key);
  }

  if (!options || !options.items) {
    throw new NoItemTypeProvidedError(target, key);
  }

  const itemOptions = _.get<IProperyOptions | undefined>(options, 'itemOptions');
  if (itemOptions && itemOptions.enum) {
    itemOptions.enum = getEnumArray(itemOptions.enum);
  }
  checkOptions(options.items, itemOptions);
  addPropertyKey(key, target);

  const propertyOptions = { options, array: true };

  setPropertyOptions(target, key, propertyOptions);
};

export const objectOptions = (options?: IObjectOptions) => <T>(target: { new(): T }) => {
  setObjectOptions(target, options);

  return target;
};
