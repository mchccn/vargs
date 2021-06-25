import Ajv, { ErrorObject, Schema } from "ajv";
import { JSONSchema7 } from "json-schema";
import { SYMBOLS } from "../constants";

class ValidationError extends Error {
  public name = "ValidationError";

  constructor(error: ErrorObject) {
    super(error.message ?? `validation failed`);
  }
}

export default function Required(schema: JSONSchema7) {
  return (target: Object, name: string | symbol, index: number) => {
    const required: { name: string | symbol; index: number; schema: Schema }[] =
      Reflect.getOwnMetadata(SYMBOLS.REQUIRED, target, name) ?? [];

    required.push({ name, index, schema });

    Reflect.defineMetadata(SYMBOLS.REQUIRED, required, target, name);
  };
}

export function validate(args: IArguments, required: { name: string | symbol; index: number; schema: Schema }[]) {
  for (const { name, index, schema } of required) {
    if (typeof args[index] === "undefined" || args[index] === null)
      throw new Error(`parameter ${String(name)} is required`);

    const validate = new Ajv().compile(schema);

    const valid = validate(args[index]);

    const [error] = validate.errors ?? [];

    if (error) throw new ValidationError(error);
  }
}
