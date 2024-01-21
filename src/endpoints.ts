import { SomeZodObject, ZodLiteral, ZodObject, z } from "zod";
import { objects } from "./objects";

export type api_method = "PUT" | "POST" | "PATCH" | "GET" | "DELETE";

type ZodEndpoint = ZodObject<{
  url: ZodLiteral<string>;
  type: ZodLiteral<api_method>;
  params: SomeZodObject;
  response: SomeZodObject;
}>;

const bla = z.strictObject({
  url: z.literal("/bla"),
  params: z.strictObject({
    id: z.string(),
    someparam: z.string(),
  }),
  type: z.literal("GET"),
  response: z.strictObject({}),
}) satisfies ZodEndpoint;

type x = typeof bla._type;

const endpoint_defs = {
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
} satisfies Record<string, ZodEndpoint>;

const endpoint_defs_object = z.object(endpoint_defs);
export type endpoint_defs_type = typeof endpoint_defs_object._type;
const endpoints: endpoint_defs_type = {
  get_user: {
    url: "/user",
    type: "GET",
    params: {
      user_id: "123",
    },
    response: {
      name: "User a",
    },
  },
  post_user: {
    url: "/user",
    type: "POST",
    params: {
      name: "User b",
    },
    response: {
      user_id: "124",
    },
  },
};
