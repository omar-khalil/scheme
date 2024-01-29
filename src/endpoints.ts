import {SomeZodObject, ZodAny, ZodLiteral, ZodNumber, ZodObject, ZodRecord, number, z} from "zod";
import {objects} from "./objects";

type api_method = "put" | "post" | "patch" | "get" | "delete";

const open_pr = z.object({type: z.literal('open'), items: z.string()});
const closed_pr = z.object({type: z.literal('closed'), closed_date: z.number()});
const pr_schema = z.union([open_pr, closed_pr]);

type ZodResponse = Record<number, SomeZodObject>;

const exampleResponseSchema = {
  200: z.object({
    a: z.number(),
  }),
  404: z.object({
    message: z.string(),
  })
} satisfies ZodResponse;

type example_inferred_response = {
  [T in keyof typeof exampleResponseSchema]: z.infer<(typeof exampleResponseSchema)[T]>
};

type ZodEndpoint = {
  url: string;
  type: api_method;
  schema: {
    params: SomeZodObject;
    response: ZodResponse;
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
      response: {
        200: objects.user,
        404: z.object({
          message: z.string(),
        })
      }
    }
  },
  post_user: {
    url: "/user",
    type: "post",
    schema: {
      params: objects.user,
      response: {
        200: z.object({
          user_id: z.string(), //backend could respond with an id for the created user
        }),
      }
    }
  },
  delete_user: {
    url: "/user",
    type: "delete",
    schema: {
      params: z.strictObject({
        user_id: z.string(),
      }),
      response: {
        200: z.object({
          message: z.string(),
        }),
      }
    }
  },
} satisfies Record<string, ZodEndpoint>;

export type params<T extends keyof typeof endpoint_schema> = z.infer<(typeof endpoint_schema)[T]['schema']['params']>;
export type response<T extends keyof typeof endpoint_schema, U extends keyof (typeof endpoint_schema)[T]['schema']['response']> = z.infer<(typeof endpoint_schema)[T]['schema']['response'][U]>;

const asdasd: response<'get_user', 404> = {
  message: 'abc',
};

type U<T extends keyof typeof endpoint_schema> = keyof (typeof endpoint_schema)[T]['schema']['response'];
const bla: U<'get_user'> = 404;

const handle_post_response: response<'get_user', 200> = {
  name: 'a'
}
