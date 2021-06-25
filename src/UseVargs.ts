import { SYMBOLS } from "./constants";
import { VargsOptions } from "./types";
import { validate as validateMax } from "./validators/Max";
import { validate as validateMin } from "./validators/Min";
import { validate as validateRequired } from "./validators/Required";

export default function UseVargs(options?: VargsOptions) {
  return (target: any, property: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) => {
    const method = descriptor.value!;

    descriptor.value = function () {
      const required = Reflect.getOwnMetadata(SYMBOLS.REQUIRED, target, property);

      if (required) validateRequired(arguments, required);

      const minimums = Reflect.getOwnMetadata(SYMBOLS.MIN, target, property);

      if (minimums) validateMin(arguments, minimums);

      const maximums = Reflect.getOwnMetadata(SYMBOLS.MAX, target, property);

      if (maximums) validateMax(arguments, maximums);

      return method.apply(this, (arguments as unknown) as any[]);
    };
  };
}
