import { VargsOptions } from "./types";
import UseVargs from "./UseVargs";

// whatever this shit is TypeScript, thanks and hippity hoppity your code is now my property
function decorate(
  decorators: ((...args: any) => unknown)[],
  target: Function,
  key: string,
  desc: PropertyDescriptor | null | undefined
) {
  const args = arguments.length;
  let r = args < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc;
  let d: typeof decorators[number];

  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc!);
  else
    for (let i = decorators.length - 1; i >= 0; i--)
      if ((d = decorators[i])) r = ((args < 3 ? d(r) : args > 3 ? d(target, key, r) : d(target, key)) || r) as typeof r;

  return args > 3 && r && Object.defineProperty(target, key, r), r;
}

export default function ApplyVargs(options?: VargsOptions) {
  return (target: Function) => {
    for (const property in target.prototype) {
      if (typeof target.prototype[property] !== "function") continue;

      const descriptor = getMethodDescriptor(property);

      decorate([UseVargs(options)], target.prototype, property, null);

      Object.defineProperty(target.prototype, property, descriptor);
    }

    function getMethodDescriptor(propertyName: string): TypedPropertyDescriptor<any> {
      if (target.prototype.hasOwnProperty(propertyName))
        return Object.getOwnPropertyDescriptor(target.prototype, propertyName)!;

      return {
        configurable: true,
        enumerable: true,
        writable: true,
        value: target.prototype[propertyName],
      };
    }
  };
}
