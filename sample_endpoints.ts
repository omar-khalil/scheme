import express from "express";
import { api_method, endpoint_defs_type } from "./src/endpoints";
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
      return {
        name: "name!",
      };
    },
  },
  post_user: {
    url: "/user",
    method: "POST",
    on_call: ({ name }) => {
      return {
        user_id: "user id!",
      };
    },
  },
};

const run_server = () => {
  const endpoints = extract_entries(endpoint_implementations).map(
    ({ key, value }) => {
      const { on_call, method, url } = value;
      app[express_methods[method]](url, (req, res) => {
        //validate request params against endpoint type, then cast i
        const response = on_call(req.params);
        res.status(200).send(response);
      });
    }
  );

  app.listen(4001, () => {
    console.log("zoho-api-server started on port 4001");
  });
};
