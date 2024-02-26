import {data_type} from "./data_types2";

const user_data_type: data_type = {
  type: 'object',
  properties: {
    name: {type: 'string'},
    age: {type: 'number'},
  }
};

const objects = {
  user: user_data_type
} satisfies Record<string, data_type>;

export default objects;
