import { SYMBOLS } from "../constants";

export default function Validate<T>(validate: (value: T) => boolean | string) {
  return (target: object, name: string | symbol, index: number) => {
    const validators: {
      name: string | symbol;
      index: number;
      validate: (value: T) => unknown | Promise<unknown>;
    }[] = Reflect.getOwnMetadata(SYMBOLS.MIN, target, name) ?? [];

    validators.push({ name, index, validate });

    Reflect.defineMetadata(SYMBOLS.MIN, validators, target, name);
  };
}

export function validate(
  args: IArguments,
  validators: {
    name: string | symbol;
    index: number;
    validate: (value: unknown) => boolean | string;
  }[]
) {
  for (const { name, index, validate } of validators) {
    if (typeof args[index] === "undefined" || args[index] === null)
      throw new Error(`parameter ${String(name)} is required`);

    const error = validate(args[index]);

    if (error)
      throw new Error(
        `validation failed for parameter ${String(name)}${typeof error === "string" ? `\nreason: ${error}` : ""}`
      );
  }
}
