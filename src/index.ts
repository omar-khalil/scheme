import {s, data_type} from "./data_types";
import {endpoint_schema} from "./endpoints";
import extract_entries from "./helpers/extract_entries";
import generate_contract from "./helpers/generate_contract";
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

//TODO: call this from a yarn script
const generate_endpoints_contract: () => void = () => {
  const all_params = extract_entries(endpoint_schema).reduce((acc, curr) => {
    return {
      ...acc, [curr.key]: s.obj({
        params: curr.value.schema.params,
        // responses: curr.value.schema.responses, //TODO: function that turns responses into a data_type
      })
    }
  }, {} as Record<keyof typeof endpoint_schema, data_type>);
  const all_endpoints = s.obj(all_params);
  generate_contract(all_endpoints, 'endpoints');
};

generate_endpoints_contract(); //why is this returning endpoint_schema unmodified?
