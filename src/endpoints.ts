import { SomeZodObject, ZodLiteral, ZodObject, z } from "zod";
import { objects } from "./objects";

export type api_method = "PUT" | "POST" | "PATCH" | "GET" | "DELETE";

type ZodEndpoint = ZodObject<{
  url: ZodLiteral<string>;
  type: ZodLiteral<api_method>;
  params: SomeZodObject;
  response: SomeZodObject;
}>;

export const endpoint_schema = {
  get_user: z.strictObject({
    url: z.literal("/user"),
    type: z.literal("GET"),
    params: z.strictObject({
      user_id: z.string(),
    }),
    response: objects.user,
  }),
  post_user: z.strictObject({
    url: z.literal("/user"),
    type: z.literal("POST"),
    params: objects.user,
    response: z.strictObject({
      user_id: z.string(), //backend could respond with an id for the created user
    }),
  }),
  delete_user: z.strictObject({
    url: z.literal("/user"),
    type: z.literal("DELETE"),
    params: z.strictObject({
      user_id: z.string(),
    }),
    response: z.strictObject({
      message: z.string(),
    }),
  }),
} satisfies Record<string, ZodEndpoint>;

const endpoint_defs_object = z.object(endpoint_schema);
export type endpoint_schema_type = z.infer<typeof endpoint_defs_object>;
