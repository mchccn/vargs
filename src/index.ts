import "reflect-metadata";
import ApplyVargs from "./ApplyVargs";
import Required from "./validators/Required";

interface Options {
  path: string;
  isModInterop: boolean;
  forceLong: boolean;
}

@ApplyVargs()
class Class {
  options(
    @Required({
      type: "object",
      properties: {
        foo: { type: "string" },
        bar: { type: "string" },
      },
      required: ["foo", "bar"],
      additionalProperties: false,
    })
    options: Options
  ) {}
}

//@ts-ignore – Test the decorator here:
new Class().options({ foo: "" });
