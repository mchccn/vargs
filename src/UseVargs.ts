import { SYMBOLS } from "./constants";
import { VargsOptions } from "./types";
import { validate as validateRequired } from "./validators/Required";

export default function UseVargs(options?: VargsOptions) {
  return (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) => {
    const method = descriptor.value!;

    descriptor.value = function () {
      const requiredParameters: {
        name: string | symbol;
        index: number;
        schema: object;
      }[] = Reflect.getOwnMetadata(SYMBOLS.REQUIRED, target, propertyName);

      if (requiredParameters) validateRequired(arguments, requiredParameters);

      return method.apply(this, (arguments as unknown) as any[]);
    };
  };
}
