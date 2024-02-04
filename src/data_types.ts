import {SomeZodObject, ZodDiscriminatedUnion, ZodLiteral, ZodObject, z} from "zod";

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

export type api_method = "put" | "post" | "patch" | "get" | "delete";
export type response_schema = ZodDiscriminatedUnion<"status", Array<ZodObject<{status: ZodLiteral<number>, data: SomeZodObject}>>>;
export type endpoint_schema_type = {
  url: string;
  type: api_method;
  schema: {
    params: SomeZodObject;
    response: response_schema;
  };
};
