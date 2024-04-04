const extract_entries: <T extends string, U extends any>(
  o: Record<T, U>
) => Array<{key: T; value: U}> = (o) => {
  type T = keyof typeof o;
  const keys = Object.keys(o).map((k) => k as T);
  return keys.map((k) => ({key: k, value: o[k]}));
};

export default extract_entries;
