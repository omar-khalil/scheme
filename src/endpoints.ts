import { AnyZodObject, SomeZodObject, ZodLiteral, ZodObject, z } from "zod";
import { objects } from "./objects";

export type api_method = "PUT" | "POST" | "PATCH" | "GET" | "DELETE";

type ZodEndpoint = {
  url: string;
  type: api_method;
  schema: {
    params: SomeZodObject;
    response: SomeZodObject;
  };
};

export const endpoint_schema = {
  get_user: {
    url: "/user",
    type: "GET",
    schema: {
      params: z.object({
        user_id: z.string(),
      }),
      response: objects.user,
    }
  },
  post_user: {
    url: "/user",
    type: "POST",
    schema: {
      params: objects.user,
      response: z.object({
        user_id: z.string(), //backend could respond with an id for the created user
      }),
    }
  },
  delete_user: {
    url: "/user",
    type: "DELETE",
    schema: {
      params: z.strictObject({
        user_id: z.string(),
      }),
      response: z.strictObject({
        message: z.string(),
      }),
    }
  },
} satisfies Record<string, ZodEndpoint>;

export type params<T extends keyof typeof endpoint_schema> = z.infer<(typeof endpoint_schema)[T]['schema']['params']>;
export type response<T extends keyof typeof endpoint_schema> = z.infer<(typeof endpoint_schema)[T]['schema']['response']>;
