import {
  ITriggerClassType,
  ITriggerContructorParams,
  AnyObject,
  ITriggerResult,
  IHelpers,
  ITriggerContext,
} from "actionsflow-interface";
import axios, { AxiosStatic } from "axios";
const AsyncFunction = Object.getPrototypeOf(async () => null).constructor;

type AsyncFunctionArguments = {
  helpers: IHelpers;
  require: NodeRequire;
  axios: AxiosStatic;
  context: ITriggerContext;
};

function callAsyncFunction<T>(
  args: AsyncFunctionArguments,
  source: string
): Promise<T> {
  const fn = new AsyncFunction(...Object.keys(args), source);
  return fn(...Object.values(args));
}

export default class Script implements ITriggerClassType {
  options: AnyObject = {};
  helpers: IHelpers;
  context: ITriggerContext;
  shouldDeduplicate = true;
  script = "";
  path = "";
  getItemKey(item: AnyObject): string {
    if (item.id) return item.id as string;
    return this.helpers.createContentDigest(item);
  }
  constructor({ helpers, options, context }: ITriggerContructorParams) {
    this.options = options;
    this.helpers = helpers;
    this.context = context;

    if (options.script) {
      this.script = options.script as string;
    } else if (options.path) {
      this.path = options.path as string;
    } else {
      throw new Error(
        "Miss param script or path, you must provide one of script or path at least"
      );
    }
  }

  async run(): Promise<ITriggerResult> {
    if (this.script) {
      const results = (await callAsyncFunction(
        {
          helpers: this.helpers,
          require: require,
          axios: axios,
          context: this.context,
        },
        this.script
      )) as ITriggerResult;
      return results;
    } else {
      return { items: [] };
    }
  }
}
