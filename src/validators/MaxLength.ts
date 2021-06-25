import { SYMBOLS } from "../constants";

export default function MaxLength(
  max: number,
  options?: { type?: "string" | "array"; inclusive?: boolean } | "string" | "array"
) {
  const { type, inclusive } =
    typeof options === "string"
      ? {
          type: options,
          inclusive: true,
        }
      : options ?? {};

  return (target: object, name: string | symbol, index: number) => {
    const maximums: {
      name: string | symbol;
      index: number;
      max: number;
      type?: "string" | "array";
      inclusive?: boolean;
    }[] = Reflect.getOwnMetadata(SYMBOLS.MAX_LENGTH, target, name) ?? [];

    maximums.push({ name, index, max, type, inclusive });

    Reflect.defineMetadata(SYMBOLS.MAX_LENGTH, maximums, target, name);
  };
}

export function validate(
  args: IArguments,
  maximums: { name: string | symbol; index: number; max: number; type?: "string" | "array"; inclusive?: boolean }[]
) {
  for (const { name, index, max, type, inclusive } of maximums) {
    if (type ? typeof args[index] !== type : typeof args[index] === "string" || Array.isArray(args[index]))
      throw new TypeError(
        `parameter ${String(name)} was given type ${typeof args[index]} but expected a ${type ?? "string or array"}`
      );

    if (inclusive && args[index].length > max)
      throw new TypeError(
        `parameter ${String(name)} has a maximum length of ${max}, inclusive, but received ${args[index]}`
      );

    if (!inclusive && args[index].length >= max)
      throw new TypeError(`parameter ${String(name)} has a maximum length of ${max} but received ${args[index]}`);
  }
}
