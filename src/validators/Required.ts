import Ajv, { ErrorObject } from "ajv";
import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { SYMBOLS } from "../constants";

class ValidationError extends Error {
  public name = "ValidationError";

  constructor(error: ErrorObject) {
    super(error.message ?? `validation failed`);
  }
}

export default function Required(schema?: JSONSchema7 | JSONSchema7TypeName | JSONSchema7TypeName[]) {
  return (target: object, name: string | symbol, index: number) => {
    const required: { name: string | symbol; index: number; schema?: JSONSchema7 }[] =
      Reflect.getOwnMetadata(SYMBOLS.REQUIRED, target, name) ?? [];

    required.push({
      name,
      index,
      schema: typeof schema === "string" || Array.isArray(schema) ? { type: schema } : schema,
    });

    Reflect.defineMetadata(SYMBOLS.REQUIRED, required, target, name);
  };
}

export function validate(args: IArguments, required: { name: string | symbol; index: number; schema?: JSONSchema7 }[]) {
  for (const { name, index, schema } of required) {
    if (typeof args[index] === "undefined" || args[index] === null)
      throw new Error(`parameter ${String(name)} is required`);

    if (schema) {
      const validate = new Ajv().compile(schema);

      validate(args[index]);

      const [error] = validate.errors ?? [];

      if (error) throw new ValidationError(error);
    }
  }
}
