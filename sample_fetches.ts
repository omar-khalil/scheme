import axios from "axios";
import {endpoint_schema, params, response} from "./src/endpoints";

const base = "http://localhost:4001";

type endpoint_key = keyof typeof endpoint_schema;

type fetcher<T extends endpoint_key> = (params: params<T>) => Promise<response<T>>
type fetchers_dict = {[k in endpoint_key]: fetcher<k>};

const create_fetcher: <T extends endpoint_key>(endpoint: T) => fetcher<T> = (endpoint) => {
  const {type, url, schema} = endpoint_schema[endpoint];
  type T = typeof endpoint;
  const func: (params: params<T>) => Promise<response<T>> = async (params) => {
    const params_string = new URLSearchParams(params).toString();

    //TODO: instead of post, use type
    const result = await axios.post(`${base}${url}?${params_string}`);
    const response = schema.response.parse(result.data);
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
  const result = await fetchers.post_user({name: "Omar"});
  console.log(result);

  // const user = await fetchers.get_user({ user_id: "abc" });
};

run_fetch();
