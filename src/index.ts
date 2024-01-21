import { z } from "zod";

const barSchema = z.object({
  klm: z.string(),
});

const fooSchema = z.object({
  abc: z.string(),
  def: z.tuple([z.string(), z.number()]),
  hij: z.object({
    bar: barSchema,
  }),
});

type x = typeof fooSchema._type;

const main: () => void = () => {
  // const result = fooSchema.parse({
  //   abc: "hi",
  // });
  fetch("https://api.datamuse.com/words?ml=test").then(async (res) => {
    const resultJson = await res.json();
    console.log(resultJson);
  });
};

main();

// type DataType = {
//   type: 'string';
//   value: string;
// } | {
//   type: 'number';
//   value: number;
// } | {
//   type: 'boolean';
//   value: boolean;
// } | {
//   type: ''
// }
// const objects =
