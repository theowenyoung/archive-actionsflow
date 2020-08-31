import {
  ITriggerClassType,
  ITriggerContructorParams,
  ITriggerRunFunctionResult,
  IHelpers,
  AnyObject,
} from "actionsflow-interface";

export default class Example implements ITriggerClassType {
  name = "example";
  options: AnyObject = {};
  helpers: IHelpers;
  every = 5;
  shouldDeduplicate = true;
  getItemKey(item: AnyObject): string {
    if (item.id) return item.id as string;
    return this.helpers.createContentDigest(item);
  }
  constructor({ helpers, options }: ITriggerContructorParams) {
    this.options = options;
    this.helpers = helpers;

    if (options.every) {
      this.every = options.every as number;
    }
  }

  async run(): Promise<ITriggerRunFunctionResult> {
    const items: AnyObject[] = [
      {
        id: "xxxxxxx1111",
        text: "hello world text",
      },
    ];
    return {
      items,
    };
  }
}
