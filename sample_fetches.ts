import axios from "axios";
import {endpoint_schema, params, response} from "./src/endpoints";
import extract_entries from "./src/extract_entries";
import {z} from "zod";

const base = "http://localhost:4001";

type endpoint_key = keyof typeof endpoint_schema;

type fetcher<T extends endpoint_key> = (params: params<T>) => Promise<response<T>>
type fetchers_dict = {[k in endpoint_key]: fetcher<k>};

const create_fetcher: <T extends endpoint_key>(endpoint: T) => fetcher<T> = (endpoint) => {
  const {type, url, schema} = endpoint_schema[endpoint];
  type T = typeof endpoint;
  switch (type) {
    case 'get':
      type get_params = z.infer<typeof schema.params>;
      const get_func: (params: params<T>) => Promise<response<T>> = async (params) => {
        const params_string = new URLSearchParams(params as get_params).toString();
        console.log(`${base}${url}?${params_string}`);
        const result = await axios[type](`${base}${url}?${params_string}`);
        const response = schema.response.parse(result.data);
        return response;
      }
      return get_func;
    case 'post':
    case 'delete':
      // type post_params = z.infer<typeof schema.params>;
      const post_func: (params: params<T>) => Promise<response<T>> = async (params) => {
        const result = await axios[type](`${base}${url}`, params);
        const response = schema.response.parse(result.data);
        return response;
      };
      return post_func;
    default:
      const invalid: never = type;
      throw invalid;
  }
};

const fetchers = extract_entries(endpoint_schema)
  .map(({key}) => ({key, fetcher: create_fetcher(key)}))
  .reduce((acc, curr) => ({...acc, [curr.key]: curr.fetcher}), {} as fetchers_dict);

const run_fetch = async () => {
  // const result = await fetchers.post_user({name: "Omar", age: 300});
  // console.log(result);

  const get_result = await fetchers.get_user({user_id: 'omar', type: 'student'});
  console.log(get_result);
};

run_fetch();
