import { SYMBOLS } from "./constants";
import { VargsOptions } from "./types";
import { validate as validateMax } from "./validators/Max";
import { validate as validateMaxLength } from "./validators/MaxLength";
import { validate as validateMin } from "./validators/Min";
import { validate as validateMinLength } from "./validators/MinLength";
import { validate as validateRequired } from "./validators/Required";
import { validate as validateValidate } from "./validators/Validate";

export default function UseVargs(options?: VargsOptions) {
  return (target: any, property: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) => {
    const method = descriptor.value!;

    descriptor.value = function () {
      {
        const required = Reflect.getOwnMetadata(SYMBOLS.REQUIRED, target, property);

        if (required) validateRequired(arguments, required);
      }

      {
        const minimums = Reflect.getOwnMetadata(SYMBOLS.MIN, target, property);

        if (minimums) validateMin(arguments, minimums);

        const maximums = Reflect.getOwnMetadata(SYMBOLS.MAX, target, property);

        if (maximums) validateMax(arguments, maximums);
      }

      {
        const minimums = Reflect.getOwnMetadata(SYMBOLS.MIN_LENGTH, target, property);

        if (minimums) validateMinLength(arguments, minimums);

        const maximums = Reflect.getOwnMetadata(SYMBOLS.MAX_LENGTH, target, property);

        if (maximums) validateMaxLength(arguments, maximums);
      }

      {
        const validators = Reflect.getOwnMetadata(SYMBOLS.VALIDATE, target, property);

        if (validators) validateValidate(arguments, validators);
      }

      return method.apply(this, (arguments as unknown) as any[]);
    };
  };
}
