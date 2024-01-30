import {SomeZodObject, ZodArray, ZodDiscriminatedUnion, ZodEnum, ZodLiteral, ZodNumber, ZodObject, ZodUnion, z} from "zod";
import {objects} from "./objects";

type api_method = "put" | "post" | "patch" | "get" | "delete";


type response_schema = ZodDiscriminatedUnion<"status", Array<ZodObject<{status: ZodLiteral<number>, data: SomeZodObject}>>>;

const response_schema_example = z.discriminatedUnion('status', [
  z.strictObject({status: z.literal(200), data: objects.user}),
  z.strictObject({status: z.literal(404), data: z.object({message: z.string()})}),
]) satisfies response_schema;

type res_type = z.infer<typeof response_schema_example>;
function fun(res: res_type): string {
  switch (res.status) {
    case 200:
      return res.data.name;
    case 404:
      return res.data.message;
  }
}

type endpoint_schema_type = {
  url: string;
  type: api_method;
  schema: {
    params: SomeZodObject;
    response: response_schema;
  };
};

export const endpoint_schema = {
  get_user: {
    url: "/user",
    type: "get",
    schema: {
      params: z.object({
        user_id: z.string(),
      }),
      response: z.discriminatedUnion("status", [
        z.strictObject({status: z.literal(200), data: objects.user}),
        z.strictObject({status: z.literal(404), data: z.object({message: z.string()})}),
      ]),
    }
  },
  post_user: {
    url: "/user",
    type: "post",
    schema: {
      params: objects.user,
      response: z.discriminatedUnion("status", [
        z.strictObject({status: z.literal(200), data: z.object({user_id: z.string()})})
      ]),
    }
  },
  delete_user: {
    url: "/user",
    type: "delete",
    schema: {
      params: z.strictObject({
        user_id: z.string(),
      }),
      response: z.discriminatedUnion("status", [
        z.strictObject({status: z.literal(200), data: z.object({message: z.string()})})
      ]),
    }
  },
} satisfies Record<string, endpoint_schema_type>;

export type params<T extends keyof typeof endpoint_schema> = z.infer<(typeof endpoint_schema)[T]['schema']['params']>;
export type response<T extends keyof typeof endpoint_schema> = z.infer<(typeof endpoint_schema)[T]['schema']['response']>;
