import {ZodAny, ZodTypeAny, z} from "zod";
import extract_entries from "./extract_entries";
import zod_to_contract from "./zod_to_contract";

type data_type =
  {type: 'string' | 'number' | 'boolean' | 'undefined' | 'null'} |
  {type: 'literal', value: string | number} |
  {type: 'enum', values: [string, ...string[]]} |
  {type: 'array', element_type: data_type} |
  {type: 'union', values: [data_type, data_type, ...data_type[]]} |
  {type: 'object', properties: Record<string, data_type>};

type du_object<T extends string> = Record<T, data_type> & Record<string, data_type | undefined>;
const discriminated_union: <T extends string>(identifier: T, objects: [du_object<T>, ...du_object<T>[]]) => data_type =
  (_, objects) => ({
    type: 'union',
    values: objects.map<data_type>((obj) => ({type: 'object', properties: obj})) as [data_type, data_type, ...data_type[]],
  });

const literal: (value: string | number) => data_type = (value) => ({type: 'literal', value});

const user_schema: data_type = {
  type: 'object',
  properties: {
    user_id: {type: 'string'},
    user_status: {type: 'enum', values: ['active', 'banned']},
    user_content: {
      type: 'union', values: [
        {type: 'literal', value: 'teacher'},
        {type: 'literal', value: 'student'}
      ]
    }
  }
}

const car_schema: data_type = {
  type: 'union',
  values: [
    {type: 'object', properties: {brand: {type: 'literal', value: 'honda'}, speed: {type: 'number'}}},
    {type: 'object', properties: {brand: {type: 'literal', value: 'bmw'}, size: {type: 'string'}}},
  ]
}

const to_zod: (data: data_type) => ZodTypeAny = (data) => {
  switch (data.type) {
    case 'string': return z.string();
    case 'number': return z.number();
    case 'boolean': return z.boolean();
    case 'undefined': return z.undefined();
    case 'null': return z.null();
    case 'literal': return z.literal(data.value);
    case 'enum': return z.enum(data.values);
    case 'array': return z.array(to_zod(data.element_type));
    case 'union': return z.union(data.values.map(to_zod) as [ZodAny, ZodAny, ...ZodAny[]]);
    case 'object':
      const zod_entries = extract_entries(data.properties).reduce((acc, curr) => ({...acc, [curr.key]: to_zod(curr.value)}), {} as Record<string, ZodTypeAny>)
      return z.object(zod_entries);
    default:
      const invalid: never = data;
      throw invalid;
  }
}

const car_schema2: data_type = discriminated_union('brand', [
  {brand: literal('honda'), speed: {type: 'number'}},
  {brand: literal('bmw'), size: {type: 'string'}},
]);

const car_schema2_zod = to_zod(car_schema2);
zod_to_contract(car_schema2_zod, 'car');
