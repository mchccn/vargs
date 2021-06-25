import { SYMBOLS } from "../constants";

export default function Max(
  max: number,
  options?: { type?: "string" | "number"; inclusive?: boolean } | "string" | "number"
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
      type?: "string" | "number";
      inclusive?: boolean;
    }[] = Reflect.getOwnMetadata(SYMBOLS.MAX, target, name) ?? [];

    maximums.push({ name, index, max, type, inclusive });

    Reflect.defineMetadata(SYMBOLS.MAX, maximums, target, name);
  };
}

export function validate(
  args: IArguments,
  maximums: { name: string | symbol; index: number; max: number; type?: "string" | "number"; inclusive?: boolean }[]
) {
  for (const { name, index, max, type, inclusive } of maximums) {
    if (type ? typeof args[index] !== type : !["string", "number"].includes(typeof args[index]))
      throw new TypeError(
        `parameter ${String(name)} was given type ${typeof args[index]} but expected a ${type ?? "string or number"}`
      );

    if (inclusive && (typeof args[index] === "string" ? args[index].length > max : args[index] > max))
      throw new TypeError(
        `parameter ${String(name)} has a maximum ${
          typeof args[index] === "string" ? "length" : "value"
        } of ${max}, inclusive, but received ${args[index]}`
      );

    if (!inclusive && (typeof args[index] === "string" ? args[index].length >= max : args[index] >= max))
      throw new TypeError(
        `parameter ${String(name)} has a maximum ${
          typeof args[index] === "string" ? "length" : "value"
        } of ${max} but received ${args[index]}`
      );
  }
}
