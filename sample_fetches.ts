import axios from "axios";
import {endpoint_schema, params, response} from "./src/endpoints";
import extract_entries from "./src/extract_entries";

const base = "http://localhost:4001";

type endpoint_key = keyof typeof endpoint_schema;

type fetcher<T extends endpoint_key> = (params: params<T>) => Promise<response<T>>
type fetchers_dict = {[k in endpoint_key]: fetcher<k>};

const create_fetcher: <T extends endpoint_key>(endpoint: T) => fetcher<T> = (endpoint) => {
  const {type, url, schema} = endpoint_schema[endpoint];
  type T = typeof endpoint;
  const func: (params: params<T>) => Promise<response<T>> = async (params) => {
    const params_string = new URLSearchParams(params).toString();

    const result = await axios[type](`${base}${url}?${params_string}`);
    const response = schema.response.parse(result.data);
    return response;
  };
  return func;
};

const fetchers = extract_entries(endpoint_schema)
  .map(({key}) => ({key, fetcher: create_fetcher(key)}))
  .reduce((acc, curr) => ({...acc, [curr.key]: curr.fetcher}), {} as fetchers_dict);

const run_fetch = async () => {
  const result = await fetchers.post_user({name: "Omar"});
  console.log(result);
};

run_fetch();
