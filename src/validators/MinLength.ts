import { SYMBOLS } from "../constants";

export default function MinLength(
  min: number,
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
    const minimums: {
      name: string | symbol;
      index: number;
      min: number;
      type?: "string" | "array";
      inclusive?: boolean;
    }[] = Reflect.getOwnMetadata(SYMBOLS.MIN_LENGTH, target, name) ?? [];

    minimums.push({ name, index, min, type, inclusive });

    Reflect.defineMetadata(SYMBOLS.MIN_LENGTH, minimums, target, name);
  };
}

export function validate(
  args: IArguments,
  minimums: { name: string | symbol; index: number; min: number; type?: "string" | "array"; inclusive?: boolean }[]
) {
  for (const { name, index, min, type, inclusive } of minimums) {
    if (type ? typeof args[index] !== type : !["string", "number"].includes(typeof args[index]))
      throw new TypeError(
        `parameter ${String(name)} was given type ${typeof args[index]} but expected a ${type ?? "string or array"}`
      );

    if (inclusive && args[index] < min)
      throw new TypeError(
        `parameter ${String(name)} has a minimum length of ${min}, inclusive, but received ${args[index]}`
      );

    if (!inclusive && args[index] <= min)
      throw new TypeError(`parameter ${String(name)} has a minimum length of ${min} but received ${args[index]}`);
  }
}
