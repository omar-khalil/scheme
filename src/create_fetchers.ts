import axios from "axios";
import {z} from "zod";
import {endpoints} from "../contracts/endpoints";
import {endpoint_schema} from "./endpoints";
import extract_entries from "./helpers/extract_entries";
import responses_to_zod from "./helpers/responses_to_zod";
import to_zod from "./helpers/to_zod";


type endpoint_key = keyof endpoints;
type params<T extends endpoint_key> = endpoints[T]['params'];
type responses<T extends endpoint_key> = endpoints[T]['responses'];

type fetcher<T extends endpoint_key> = (params: params<T>) => Promise<responses<T>>
type fetchers_dict = {[k in endpoint_key]: fetcher<k>};

const create_fetcher: <T extends endpoint_key>(base_url: string, endpoint: T) => fetcher<T> = (base, endpoint) => {
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

export const create_fetchers: (base_url: string) => fetchers_dict = (base) => extract_entries(endpoint_schema)
  .map(({key}) => ({key, fetcher: create_fetcher(base, key)}))
  .reduce((acc, curr) => ({...acc, [curr.key]: curr.fetcher}), {} as fetchers_dict);
