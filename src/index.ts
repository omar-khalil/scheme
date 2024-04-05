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
    const responses_schemafied = curr.value.schema.responses.map(({status, data}) => s.obj({status: s.literal(status), data}))
    //TODO: if responses_schemafied.length < 2, do not union (won't fit below 'as' casting)
    const responses_union = s.union(responses_schemafied as [data_type, data_type, ...data_type[]]);
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

generate_endpoints_contract(); //why is this returning endpoint_schema unmodified?

const foo: (endpoint: endpoints['get_user']) => void = (endpoint) => {
  switch (endpoint.responses.status) {
    case 200:
      const {age, name} = endpoint.responses.data;
      break;
    case 404:
      const {message} = endpoint.responses.data;
  }
}
