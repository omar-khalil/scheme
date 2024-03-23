import {endpoint_schema} from "./endpoints2";
import extract_entries from "./extract_entries";
import {generate_contract} from "./zod_to_contract";

const generate_contracts = () => {
  extract_entries(endpoint_schema).map(({key, value}) => {
    const params = value.schema.params;
    generate_contract(params, key);
  });
};
generate_contracts();
