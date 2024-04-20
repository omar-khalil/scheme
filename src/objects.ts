import {data_type, s} from "./data_types";

const user_data_type: data_type = {
  type: 'object',
  properties: {
    name: s.str(),
    age: s.num(),
    user_type: s.enum(['student', 'teacher']),
  }
};

const objects = {
  user: user_data_type
} satisfies Record<string, data_type>;

export default objects;
