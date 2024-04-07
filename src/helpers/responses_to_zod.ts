import {ZodTypeAny} from "zod";
import {data_type, endpoint_schema_type, s, union_type} from "../data_types";
import to_zod from "./to_zod";
import {response} from "../old/endpoints_old";

export const responses_to_schema: (responses: endpoint_schema_type['schema']['responses']) => union_type = (responses) => {
  const responses_schemafied = responses.map(({status, data}) => s.obj({status: s.literal(status), data}))
  //TODO: if responses_schemafied.length < 2, do not union (won't fit below  'as' casting)
  const responses_union = s.union(responses_schemafied as [data_type, data_type, ...data_type[]]);
  return responses_union;
}

const responses_to_zod: (responses: endpoint_schema_type['schema']['responses']) => ZodTypeAny = (responses) => {
  const responses_union = responses_to_schema(responses);
  const zod_responses = to_zod(responses_union);
  return zod_responses;
}

export default responses_to_zod;
