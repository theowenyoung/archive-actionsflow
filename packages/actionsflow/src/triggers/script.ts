import {
  ITriggerClassType,
  ITriggerContructorParams,
  AnyObject,
  ITriggerResult,
  IHelpers,
  ITriggerContext,
} from "actionsflow-interface";
import resolveCwd from "resolve-cwd";
import { isPromise } from "../utils";
import axios, { AxiosStatic } from "axios";
const AsyncFunction = Object.getPrototypeOf(async () => null).constructor;

type AsyncFunctionArguments = {
  helpers: IHelpers;
  require: NodeRequire;
  axios: AxiosStatic;
  context: ITriggerContext;
  options: AnyObject;
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
    const deduplication_key = this.options.deduplication_key;
    if (deduplication_key) {
      return item[deduplication_key as string] as string;
    }
    if (item.id) return item.id as string;
    if (item.key) return item.key as string;
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
    }
  }

  async run(): Promise<ITriggerResult> {
    const functionContext: AsyncFunctionArguments = {
      helpers: this.helpers,
      require: require,
      axios: axios,
      context: this.context,
      options: this.options,
    };
    if (this.script) {
      const results = (await callAsyncFunction(
        functionContext,
        this.script
      )) as ITriggerResult;
      return results;
    } else if (this.path) {
      const scriptPath = resolveCwd.silent(this.path);
      if (scriptPath) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const scriptFunction = require(scriptPath);
        const scriptFunctionResult = scriptFunction(functionContext);
        if (isPromise(scriptFunctionResult)) {
          return await scriptFunctionResult;
        }
        return scriptFunctionResult;
      } else {
        this.helpers.log.warn(
          `can not found the path ${this.path}, skip [script] trigger`
        );
        return { items: [] };
      }
    } else {
      throw new Error(
        "Miss param script or path, you must provide one of script or path at least"
      );
    }
  }
}
