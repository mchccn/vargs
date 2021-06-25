import { SYMBOLS } from "../constants";

export default function Type(
  type: "string" | "number" | "boolean" | "symbol" | "bigint" | "function" | "object" | "undefined"
) {
  return (target: object, name: string | symbol, index: number) => {
    const types: {
      name: string | symbol;
      index: number;
      type: "string" | "number" | "boolean" | "symbol" | "bigint" | "function" | "object" | "undefined";
    }[] = Reflect.getOwnMetadata(SYMBOLS.TYPE, target, name) ?? [];

    types.push({ name, index, type });

    Reflect.defineMetadata(SYMBOLS.TYPE, types, target, name);
  };
}

export function validate(
  args: IArguments,
  types: {
    name: string | symbol;
    index: number;
    type: "string" | "number" | "boolean" | "symbol" | "bigint" | "function" | "object" | "undefined";
  }[]
) {
  for (const { name, index, type } of types) {
    if (typeof args[index] === "undefined" || args[index] === null)
      throw new Error(`parameter ${String(name)} is required`);

    if (typeof args[index] !== type)
      throw new TypeError(
        `parameter ${String(name)} was given type ${typeof args[index]} but expected ${
          type === "undefined" ? "undefined" : `a${type.startsWith("o") ? "n" : ""} ${type}`
        }`
      );
  }
}
