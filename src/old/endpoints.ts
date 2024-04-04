import {objects} from "./objects";
import {endpoint_schema_type, response_schema, s} from "./data_types";
import {z} from "zod";
import extract_entries from "../helpers/extract_entries";

const bla: Record<200, string> & Record<number, string | undefined> = {
  200: 'abc',
  123: 'bla'
};

const make_res: (params: Record<200, object> & Record<number, object | undefined>) => response_schema = (params) => {
  const entries = extract_entries(params);
  return s.du("status", [s.obj({status: s.const(200), data: s.obj({})})]);
};

export const endpoint_schema = {
  get_user: {
    url: "/user",
    type: "get",
    schema: {
      params: s.obj({
        user_id: s.str,
        type: s.enum(['student', 'user'])
      }),
      //TODO: simplify creating responses further
      response: s.du("status", [
        s.obj({status: s.const(200), data: objects.user}),
        s.obj({status: s.const(404), data: s.obj({message: s.str})}),
      ]),
    }
  },
  post_user: {
    url: "/user",
    type: "post",
    schema: {
      params: objects.user,
      response: s.du("status", [
        s.obj({status: s.const(200), data: s.obj({user_id: s.str})})
      ]),
    }
  },
  delete_user: {
    url: "/user",
    type: "delete",
    schema: {
      params: s.obj({
        user_id: s.str,
      }),
      response: s.du("status", [
        s.obj({status: s.const(200), data: s.obj({message: s.str})})
      ]),
    }
  },
} satisfies Record<string, endpoint_schema_type>;

export type params<T extends keyof typeof endpoint_schema> = z.infer<(typeof endpoint_schema)[T]['schema']['params']>;
export type response<T extends keyof typeof endpoint_schema> = z.infer<(typeof endpoint_schema)[T]['schema']['response']>;
