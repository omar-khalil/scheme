import axios from "axios";
import {z} from "zod";
import {endpoint_schema} from "./src/endpoints";
import extract_entries from "./src/helpers/extract_entries";
import to_zod from "./src/helpers/to_zod";
import responses_to_zod from "./src/helpers/responses_to_zod";
import {endpoints} from "./contracts/endpoints";

const base = "http://localhost:4001";

type endpoint_key = keyof endpoints;
type params<T extends endpoint_key> = endpoints[T]['params'];
type responses<T extends endpoint_key> = endpoints[T]['responses'];

type fetcher<T extends endpoint_key> = (params: params<T>) => Promise<responses<T>>
type fetchers_dict = {[k in endpoint_key]: fetcher<k>};

const create_fetcher: <T extends endpoint_key>(endpoint: T) => fetcher<T> = (endpoint) => {
  const {type, url, schema} = endpoint_schema[endpoint];
  const zod_responses = responses_to_zod(schema.responses);
  type T = typeof endpoint;
  switch (type) {
    case 'get':
      const zod_params = to_zod(schema.params);
      type get_params = z.infer<typeof zod_params>;
      const get_func: (params: params<T>) => Promise<responses<T>> = async (params) => {
        const params_string = new URLSearchParams(params as get_params).toString();
        console.log(`${base}${url}?${params_string}`);
        const result = await axios[type](`${base}${url}?${params_string}`);
        const response = zod_responses.parse(result.data);
        return response;
      }
      return get_func;
    case 'post':
    case 'delete':
      // type post_params = z.infer<typeof schema.params>;
      const post_func: (params: params<T>) => Promise<responses<T>> = async (params) => {
        const result = await axios[type](`${base}${url}`, params);
        const response = zod_responses.parse(result.data);
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
  const post_result = await fetchers.post_user({name: "Omar", age: 300});
  console.log(post_result);

  const get_result = await fetchers.get_user({user_id: 'omar', user_type: 'student'});
  console.log(get_result);
};

run_fetch();
