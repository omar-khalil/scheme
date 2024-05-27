import {optional} from "zod";

type object_data_type = {type: 'object', properties: Record<string, data_type>};
type string_data_type =
  {type: 'string'} |
  {type: 'enum', values: [string, ...string[]]} |
  {type: 'literal', value: string | number};
export type union_type = {type: 'union', values: [data_type, data_type, ...data_type[]]};
export type data_type =
  {type: 'number'} | {type: 'boolean'} | {type: 'undefined'} | {type: 'null'} |
  {type: 'array', element_type: data_type} |
  union_type |
  string_data_type |
  object_data_type;

type du_object<T extends string> = Record<T, data_type> & Record<string, data_type | undefined>;
export const s = {
  str: () => ({type: 'string'}),
  num: () => ({type: 'number'}),
  bool: () => ({type: 'boolean'}),
  literal: (value: string | number) => ({type: 'literal', value}),
  enum: (values: [string, ...string[]]) => ({type: 'enum', values}),
  array: (element_type: data_type) => ({type: 'array', element_type}),
  union: (values: [data_type, data_type, ...data_type[]]) => ({type: 'union', values}),
  du: <T extends string>(identifier: T, objects: [du_object<T>, ...du_object<T>[]]) => ({
    type: 'union',
    values: objects.map<data_type>((obj) => ({type: 'object', properties: obj})) as [data_type, data_type, ...data_type[]],
  }),
  obj: (properties: Record<string, data_type>) => ({type: 'object', properties: properties}),
  string_record: (properties: Record<string, string_data_type>) => ({type: 'object', properties: properties}),
  optional: (value: data_type) => ({type: 'union', values: [value, {type: 'undefined'}]}),
  nullable: (value: data_type) => ({type: 'union', values: [value, {type: 'null'}]}),
} satisfies Record<string, (props1: any, props2: any) => data_type>;

type api_method = "put" | "post" | "patch" | "delete" | "get";
type response_schema = Array<{status: number, data: object_data_type}>
export type endpoint_schema_type = {
  url: string;
  type: Exclude<api_method, "get">;
  schema: {
    params: object_data_type;
    responses: response_schema;
  };
} | {
  url: string;
  type: 'get';
  schema: {
    params: {type: 'object', properties: Record<string, string_data_type>}; //Get requests can only contain params of type Record<string, string>. What about optional strings?
    responses: response_schema;
  };
};
