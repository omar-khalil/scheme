import {ZodAny, ZodTypeAny, z} from "zod";
import extract_entries from "./extract_entries";
import zod_to_contract from "./zod_to_contract";
import to_zod from "./to_zod";

type object_data_type = {type: 'object', properties: Record<string, data_type>};
type string_data_type =
  {type: 'string'} |
  {type: 'enum', values: [string, ...string[]]} |
  {type: 'literal', value: string | number};

export type data_type =
  {type: 'number' | 'boolean' | 'undefined' | 'null'} |
  {type: 'array', element_type: data_type} |
  {type: 'union', values: [data_type, data_type, ...data_type[]]} |
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


const create_car_example = () => {
  const car_schema2: data_type = s.du('brand', [
    {brand: s.literal('honda'), speed: {type: 'number'}},
    {brand: s.literal('bmw'), size: {type: 'string'}},
  ]);

  const car_schema2_zod = to_zod(car_schema2);
  zod_to_contract(car_schema2_zod, 'car');
};
