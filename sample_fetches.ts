import axios from "axios";
import { endpoint_schema, endpoint_schema_type } from "./src/endpoints";
import extract_entries from "./src/extract_entries";

const base = "http://localhost:4001";

type endpoint_key = keyof endpoint_schema_type;

const endpoints: {
  [p in endpoint_key]: {
    url: endpoint_schema_type[p]["url"];
    type: endpoint_schema_type[p]["type"];
  };
} = {
  delete_user: {
    type: "DELETE",
    url: "/user",
  },
  get_user: {
    type: "GET",
    url: "/user",
  },
  post_user: {
    type: "POST",
    url: "/user",
  },
};

type fetchers_dict = {
  [p in endpoint_key]: (
    params: endpoint_schema_type[p]["params"]
  ) => Promise<endpoint_schema_type[p]["response"]>;
};

const create_fetcher: <T extends endpoint_key>(
  endpoint: T
) => (
  params: endpoint_schema_type[T]["params"]
) => Promise<endpoint_schema_type[T]["response"]> = (endpoint) => {
  const { type, url } = endpoints[endpoint];
  const func: (
    params: endpoint_schema_type[typeof endpoint]["params"]
  ) => Promise<endpoint_schema_type[typeof endpoint]["response"]> = async (
    params
  ) => {
    const params_string = new URLSearchParams(params).toString();

    //instead of post, use type
    const result = await axios.post(`${base}${url}?${params_string}`);
    const { response } = endpoint_schema[endpoint]
      .pick({ response: true })
      .parse({ response: result.data });
    return response;
  };
  return func;
};

const fetchers: fetchers_dict = {
  post_user: create_fetcher("post_user"),
  delete_user: create_fetcher("delete_user"),
  get_user: create_fetcher("get_user"),
}; //TODO: create automatically by mapping through endpoint keys and reducing them to this object

const run_fetch = async () => {
  const result = await fetchers.post_user({ name: "Omar" });
  console.log(result);

  // const user = await fetchers.get_user({ user_id: "abc" });
};

run_fetch();
