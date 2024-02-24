import {ZodAny, ZodFirstPartySchemaTypes, ZodTypeAny} from "zod";
import {createTypeAlias, printNode, zodToTs} from "zod-to-ts";
import write_to_file from "./write_to_file";

const zod_to_contract: (schema: ZodTypeAny, identifier: string) => void = (schema, identifier) => {
  const {node, store} = zodToTs(schema, identifier);
  const typeAlias = createTypeAlias(node, identifier);
  const nodeString = printNode(typeAlias);
  write_to_file(nodeString, 'test.ts');
};

export default zod_to_contract;
