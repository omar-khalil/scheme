import {endpoint_schema_type} from "./data_types2";
import objects from "./objects2";
import {generate_contract} from "./zod_to_contract";

export const endpoint_schema = {
  get_user: {
    url: "/user",
    type: "get",
    schema: {
      params: {
        type: 'object',
        properties: {
          user_id: {type: 'string'},
          user_type: {type: 'enum', values: ['student', 'teacher']},
        },
      },
      responses: [
        {status: 200, data: objects.user},
        {status: 404, data: {type: 'object', properties: {message: {type: 'string'}}}},
      ]
    }
  },
  post_user: {
    url: "/user",
    type: "post",
    schema: {
      params: objects.user,
      responses: [
        {status: 200, data: {type: 'object', properties: {user_id: {type: 'string'}}}}
      ]
    }
  },
  delete_user: {
    url: "/user",
    type: "delete",
    schema: {
      params: {type: 'object', properties: {user_id: {type: 'string'}}},
      responses: [
        {status: 200, data: {type: 'object', properties: {message: {type: 'string'}}}}
      ]
    }
  },
} satisfies Record<string, endpoint_schema_type>;

generate_contract(endpoint_schema.get_user.schema.responses[1].data, 'params');
