import {z} from "zod";
import {s} from "./data_types";
import {createTypeAlias, printNode, zodToTs} from "zod-to-ts";
import write_to_file from "../helpers/write_to_file";

const userSchema = s.obj({
  name: s.str,
  age: s.num,
});

export const objects = {
  user: userSchema,
  school: s.obj({
    users: s.array(userSchema),
  }),
  class: s.obj({
    max_users: s.num,
    current_users: s.array(userSchema),
  }),
} satisfies Record<string, z.AnyZodObject>;

const allObjects = s.obj(objects);
export type objectTypes = z.infer<typeof allObjects>;

const identifier = 'userbla';
const {node, store} = zodToTs(userSchema, identifier);
const typeAlias = createTypeAlias(node, identifier);
const nodeString = printNode(typeAlias);
write_to_file(nodeString, 'test.ts');
console.log(nodeString);
