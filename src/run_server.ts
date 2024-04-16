import express from "express";
import {endpoints} from "../contracts/endpoints";
import {endpoint_schema} from "./endpoints";
import extract_entries from "./helpers/extract_entries";
import to_zod from "./helpers/to_zod";

type endpoint_key = keyof endpoints;
type params<T extends endpoint_key> = endpoints[T]['params'];
type responses<T extends endpoint_key> = endpoints[T]['responses'];

export const run_server = (endpoints: {[p in endpoint_key]: (params: params<p>) => Promise<responses<p>>}) => {
  const app = express();
  app.use(express.json());
  extract_entries(endpoints).forEach(({key, value: method}) => {
    const {type, url, schema} = endpoint_schema[key];
    app[type](url, async (req, res) => {
      const params_zod = to_zod(schema.params);
      const params = params_zod.parse(type === 'get' ? req.query : req.body); //validate request params against endpoint schema. Throws an error if params doesn't match

      const response = await method(params as any); //now that params has been validated, it's safe to use 'as any' here
      res.status(200).send(response);
    });
  });

  const PORT = 4001;
  app.listen(PORT, () => {
    console.log(`api-server started on port http://localhost:${PORT}`);
  });
};
