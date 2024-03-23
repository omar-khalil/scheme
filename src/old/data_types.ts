import {SomeZodObject, ZodDiscriminatedUnion, ZodEnum, ZodLiteral, ZodObject, ZodRecord, ZodString, object, z} from "zod";
import {objects} from "./objects";

const create_keyed_object: <T extends string, O extends object>(key: T, rest: {[K in T]: string} & O) => {[K in T]: string} & O = (key, rest) => {
  return rest;
};

const x = create_keyed_object('bla', {bla: 'abc', foo: 'def'});
x.bla;
x.foo;

//necessary?
export const s = {
  obj: z.object,
  str: z.string(),
  num: z.number(),
  const: z.literal,
  enum: z.enum,
  du: z.discriminatedUnion,
  array: z.array,
  optional: z.optional,
}

const du_example = s.du('type', [
  s.obj({type: s.const('abc'), prop1: z.string()}),
  s.obj({type: s.const('def'), prop2: z.number()}),
])

export type api_method = "put" | "post" | "patch" | "delete" | "get";
export type response_schema = ZodDiscriminatedUnion<"status", Array<ZodObject<{status: ZodLiteral<number>, data: SomeZodObject}>>>;
export type endpoint_schema_type = {
  url: string;
  type: Exclude<api_method, "get">;
  schema: {
    params: SomeZodObject;
    response: response_schema;
  };
} | {
  url: string;
  type: 'get';
  schema: {
    params: ZodObject<Record<string, ZodString | ZodEnum<[string, ...string[]]> | ZodLiteral<string>>>; //Get requests can only contain params of type Record<string, string>. What about optional strings?
    response: response_schema;
  };
};
