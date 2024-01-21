import { ZodObject, z } from "zod";

const userType = z.strictObject({
  name: z.string(),
});

export const objects = {
  user: userType,
  school: z.object({
    users: z.array(userType),
  }),
  class: z.object({
    maxUsers: z.number(),
  }),
} satisfies Record<string, z.AnyZodObject>;

const allObjects = z.object(objects);

type objectTypes = typeof allObjects._type;

const someClass: objectTypes["class"] = {
  maxUsers: 3,
};

const someSchool: objectTypes["school"] = {
  users: [{ name: "user a" }, { name: "user b" }],
};

const someUser: objectTypes["user"] = {
  name: "user a",
};
