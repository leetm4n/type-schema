import { Schema } from './schema';

export type TJSONSchemaFormat = 'date-time' | 'email' | 'hostname' | 'ipv4' | 'ipv6' | 'uri';

export interface ISchemaAnnotated extends Schema {
  options?: IObjectOptions;
  properties?: IProperties[];
}

export interface IItemOptions {
  minimum?: number;
  maximum?: number;
  format?: TJSONSchemaFormat;
  minLength?: number;
  maxLength?: number;
}

export interface IProperyOptions extends IItemOptions {
  required?: boolean;
  enum?: { [key: number]: string } | (string | number | null)[];
}

export interface IArrayPropertyOptions {
  required?: boolean;
  items: any;
  minItems?: number;
  maxItems?: number;
  itemOptions?: IItemOptions;
}

export interface IObjectOptions {
  $async?: boolean;
  additionalProperties?: boolean;
}

export interface IProperties {
  key: string;
  array: boolean;
  type?: any;
  options?: IProperyOptions | IArrayPropertyOptions;
}
