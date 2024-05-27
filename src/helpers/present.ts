export const present = <T>(value: T | null | undefined): value is NonNullable<T> => value !== null && value !== undefined;
