import { SYMBOLS } from "../constants";

export default function Min(
  min: number,
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
    const minimums: {
      name: string | symbol;
      index: number;
      min: number;
      type?: "string" | "number";
      inclusive?: boolean;
    }[] = Reflect.getOwnMetadata(SYMBOLS.MIN, target, name) ?? [];

    minimums.push({ name, index, min, type, inclusive });

    Reflect.defineMetadata(SYMBOLS.MIN, minimums, target, name);
  };
}

export function validate(
  args: IArguments,
  minimums: { name: string | symbol; index: number; min: number; type?: "string" | "number"; inclusive?: boolean }[]
) {
  for (const { name, index, min, type, inclusive } of minimums) {
    if (type ? typeof args[index] !== type : !["string", "number"].includes(typeof args[index]))
      throw new TypeError(
        `parameter ${String(name)} was given type ${typeof args[index]} but expected a ${type ?? "string or number"}`
      );

    if (inclusive && (typeof args[index] === "string" ? args[index].length < min : args[index] < min))
      throw new TypeError(
        `parameter ${String(name)} has a minimum ${
          typeof args[index] === "string" ? "length" : "value"
        } of ${min}, inclusive, but received ${args[index]}`
      );

    if (!inclusive && (typeof args[index] === "string" ? args[index].length <= min : args[index] <= min))
      throw new TypeError(
        `parameter ${String(name)} has a minimum ${
          typeof args[index] === "string" ? "length" : "value"
        } of ${min} but received ${args[index]}`
      );
  }
}
