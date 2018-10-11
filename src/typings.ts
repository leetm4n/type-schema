export type TJSONSchemaFormat = 'date-time' | 'email' | 'hostname' | 'ipv4' | 'ipv6' | 'uri';

export interface IItemOptions {
  enum?: { [key: number]: string } | (string | number | null)[];
  minimum?: number;
  maximum?: number;
  format?: TJSONSchemaFormat;
  minLength?: number;
  maxLength?: number;
}

export interface IProperyOptions extends IItemOptions {
  required?: boolean;
}

export interface IRawPropertyOptions {
  jsonSchema: object;
  required?: boolean;
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

export interface IProperty {
  array?: boolean;
  raw?: boolean;
  type?: any;
  options?: IProperyOptions | IArrayPropertyOptions | IRawPropertyOptions;
}
