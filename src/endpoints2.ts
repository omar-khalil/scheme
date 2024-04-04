import {endpoint_schema_type, s} from "./data_types2";
import objects from "./objects2";

export const endpoint_schema = {
  get_user: {
    url: "/user",
    type: "get",
    schema: {
      params: s.string_record({ //FIXME: maybe params should just accept an object that gets chewed into a datatype later, like with responses?
        user_id: s.str(),
        user_type: s.enum(['student', 'teacher']),
      }),
      responses: [
        {status: 200, data: objects.user},
        {status: 404, data: s.obj({message: s.str()})},
      ]
    }
  },
  post_user: {
    url: "/user",
    type: "post",
    schema: {
      params: objects.user,
      responses: [
        {status: 200, data: s.obj({user_id: s.str()})}
      ]
    }
  },
  delete_user: {
    url: "/user",
    type: "delete",
    schema: {
      params: s.obj({user_id: s.str()}),
      responses: [
        {status: 200, data: {type: 'object', properties: {message: s.str()}}}
      ]
    }
  },
} satisfies Record<string, endpoint_schema_type>;
