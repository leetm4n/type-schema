import * as _ from 'lodash';
import 'reflect-metadata';

import { IProperyOptions, ISchemaAnnotated, IArrayPropertyOptions, IObjectOptions } from './typings';
import { Schema } from './schema';
import { checkOptions } from './utils';
import { NoItemTypeProvidedError } from './errors';

export const property = (options?: IProperyOptions) => (target: Schema, key: string) => {
  const type = Reflect.getMetadata('design:type', target, key);

  checkOptions(type, options);

  const property = { type, key, options, array: false };

  const tar = (target as ISchemaAnnotated);
  if (!tar.properties) {
    tar.properties = [property];
  } else {
    tar.properties.push(property);
  }
};

export const arrayProperty = (options?: IArrayPropertyOptions) => (target: Schema, key: string) => {
  const property = { key, options, array: true };

  if (!options || !options.items) {
    throw new NoItemTypeProvidedError();
  }

  const itemOptions = _.get(options, 'itemOptions');
  checkOptions(options!.items, itemOptions);

  const tar = target as ISchemaAnnotated;
  if (!tar.properties) {
    tar.properties = [property];
  } else {
    tar.properties.push(property);
  }
};

export const objectOptions = (options?: IObjectOptions) => <T extends Schema>(target: { new(): T }) => {
  target.prototype.options = options;

  return target;
};