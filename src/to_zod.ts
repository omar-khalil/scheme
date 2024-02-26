import {ZodTypeAny, z, ZodAny} from "zod";
import {data_type} from "./data_types2";
import extract_entries from "./extract_entries";

const to_zod: (data: data_type) => ZodTypeAny = (data) => {
  switch (data.type) {
    case 'string': return z.string();
    case 'number': return z.number();
    case 'boolean': return z.boolean();
    case 'undefined': return z.undefined();
    case 'null': return z.null();
    case 'literal': return z.literal(data.value);
    case 'enum': return z.enum(data.values);
    case 'array': return z.array(to_zod(data.element_type));
    case 'union': return z.union(data.values.map(to_zod) as [ZodAny, ZodAny, ...ZodAny[]]);
    case 'object':
      const zod_entries = extract_entries(data.properties).reduce((acc, curr) => ({...acc, [curr.key]: to_zod(curr.value)}), {} as Record<string, ZodTypeAny>)
      return z.object(zod_entries);
    default:
      const invalid: never = data;
      throw invalid;
  }
}

export default to_zod;
