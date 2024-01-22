import express from "express";
import {
  api_method,
  endpoint_schema,
  endpoint_defs_type,
} from "./src/endpoints";
import extract_entries from "./src/extract_entries";

const app = express();

type endpoint_keys = keyof endpoint_defs_type;

//T = parameters, U = response, R = url, M = method
type handler<T extends object, U, R, M> = {
  on_call: (params: T) => U;
  url: R;
  method: M;
};

const express_methods: { [k in api_method]: Lowercase<k> } = {
  PUT: "put",
  POST: "post",
  DELETE: "delete",
  GET: "get",
  PATCH: "patch",
};

const endpoint_implementations: {
  [p in endpoint_keys]: handler<
    endpoint_defs_type[p]["params"],
    endpoint_defs_type[p]["response"],
    endpoint_defs_type[p]["url"],
    endpoint_defs_type[p]["type"]
  >;
} = {
  get_user: {
    url: "/user",
    method: "GET",
    on_call: ({ user_id }) => {
      console.log(user_id);
      return {
        name: "name!",
      };
    },
  },
  post_user: {
    url: "/user",
    method: "POST",
    on_call: ({ name }) => {
      console.log(name);
      return {
        user_id: "user id!",
      };
    },
  },
  delete_user: {
    url: "/user",
    method: "DELETE",
    on_call: ({ user_id }) => {
      console.log(`Deleting ${user_id}`);
      return {
        message: `Successfully deleted ${user_id}`,
      };
    },
  },
};

const run_server = () => {
  extract_entries(endpoint_implementations).forEach(({ key, value }) => {
    const { on_call, method, url } = value;
    app[express_methods[method]](url, (req, res) => {
      console.log({ query: req.query, params: req.params });
      //validate request params against endpoint schema. Throws an error if params doesn't match
      const { params } = endpoint_schema[key]
        .pick({ params: true })
        .parse({ params: req.query });
      const response = on_call(params as any); //now that params has been validated, it's safe to use 'as any' here
      res.status(200).send(response);
    });
  });

  const PORT = 4001;
  app.listen(PORT, () => {
    console.log(`api-server started on port http://localhost:${PORT}`);
  });
};

run_server();
