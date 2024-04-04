import {ZodAny, ZodFirstPartySchemaTypes, ZodTypeAny} from "zod";
import {createTypeAlias, printNode, zodToTs} from "zod-to-ts";
import write_to_file from "./write_to_file";
import {data_type} from "../data_types2";
import to_zod from "./to_zod";

const generate_contract: (schema: data_type, identifier: string) => void = (schema, identifier) => {
  const zod_schema = to_zod(schema);
  const {node} = zodToTs(zod_schema, identifier);
  const typeAlias = createTypeAlias(node, identifier);
  const nodeString = printNode(typeAlias);
  write_to_file(nodeString, process.cwd() + `\\contracts\\${identifier}.d.ts`);
};

export default generate_contract;
