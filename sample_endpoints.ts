import express from "express";
import {
  api_method,
  endpoint_schema,
  params,
  response,
} from "./src/endpoints";
import extract_entries from "./src/extract_entries";

const app = express();

type endpoint_keys = keyof typeof endpoint_schema;

//T = parameters, U = response, R = url, M = method
// type handler<T extends object, U, R, M> = {
//   on_call: (params: T) => U;
//   url: R;
//   method: M;
// };

const express_methods: {[k in api_method]: Lowercase<k>} = {
  PUT: "put",
  POST: "post",
  DELETE: "delete",
  GET: "get",
  PATCH: "patch",
};

const endpoint_implementations: {[p in endpoint_keys]: (params: params<p>) => response<p>} = {
  get_user: ({user_id}) => {
    console.log(`Getting ${user_id}`);
    return {
      name: "name!",
    };
  },
  post_user: ({name}) => {
    console.log(`Posting ${name}`);
    return {
      user_id: "user id!",
    };
  },
  delete_user: ({user_id}) => {
    console.log(`Deleting ${user_id}`);
    return {
      message: `Successfully deleted ${user_id}`,
    };
  },
};

const run_server = () => {
  extract_entries(endpoint_implementations).forEach(({key, value: method}) => {
    const {type, url, schema} = endpoint_schema[key];
    app[express_methods[type]](url, (req, res) => {
      //validate request params against endpoint schema. Throws an error if params doesn't match
      const params = schema.params.parse(req.query);
      //now that params has been validated, it's safe to use 'as any' here
      const response = method(params as any);
      res.status(200).send(response);
    });
  });

  const PORT = 4001;
  app.listen(PORT, () => {
    console.log(`api-server started on port http://localhost:${PORT}`);
  });
};

run_server();
