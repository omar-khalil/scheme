import {z} from "zod";
import {s} from "./data_types";

const user_type = s.obj({
  name: s.str,
  age: s.num,
});

export const objects = {
  user: user_type,
  school: s.obj({
    users: s.array(user_type),
  }),
  class: s.obj({
    max_users: s.num,
    current_users: s.array(user_type),
  }),
} satisfies Record<string, z.AnyZodObject>;

const allObjects = s.obj(objects);
export type objectTypes = z.infer<typeof allObjects>;
