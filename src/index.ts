import {s, data_type} from "./data_types";
import {endpoint_schema} from "./endpoints";
import extract_entries from "./helpers/extract_entries";
import generate_contract from "./helpers/generate_contract";
import {responses_to_schema} from "./helpers/responses_to_zod";

/**
 * end result will be a type:
 * type endpoints = {
 *  post_user: {
 *    params: {
 *     name: string;
 *     age: number; 
 *    },
 *    reponses: ...etc
 *  }
 * }
 */

//TODO: call this automatically when exporting to a package
const generate_endpoints_contract: () => void = () => {
  const all_params = extract_entries(endpoint_schema).reduce((acc, curr) => {
    const responses_union = responses_to_schema(curr.value.schema.responses);
    return {
      ...acc, [curr.key]: s.obj({
        params: curr.value.schema.params,
        responses: responses_union,
      })
    }
  }, {} as Record<keyof typeof endpoint_schema, data_type>);
  const all_endpoints = s.obj(all_params);
  generate_contract(all_endpoints, 'endpoints');
};

generate_endpoints_contract();
