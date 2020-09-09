import {
  ITriggerClassType,
  ITriggerContructorParams,
  AnyObject,
  ITriggerOptions,
  ITriggerResult,
  IHelpers,
  IWorkflow,
} from "actionsflow-interface";
import { GitHub } from "@actions/github/lib/utils";
import { OctokitOptions } from "@octokit/core/dist-types/types";

import resolveCwd from "resolve-cwd";
import { getOctokit } from "@actions/github";
import { isPromise } from "actionsflow-core";
import { resolve } from "path";
const AsyncFunction = Object.getPrototypeOf(async () => null).constructor;

type AsyncFunctionArguments = {
  helpers: IHelpers;
  require: NodeRequire;
  options: ITriggerOptions;
  github?: InstanceType<typeof GitHub>;
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
  workflow: IWorkflow;
  shouldDeduplicate = true;
  getItemKey(item: AnyObject): string {
    const deduplication_key = this.options.deduplication_key;
    if (deduplication_key) {
      return item[deduplication_key as string] as string;
    }
    if (item.id) return item.id as string;
    if (item.key) return item.key as string;
    return this.helpers.createContentDigest(item);
  }
  constructor({ helpers, options, workflow }: ITriggerContructorParams) {
    this.options = options;
    this.helpers = helpers;
    this.workflow = workflow;
  }

  async run(): Promise<ITriggerResult> {
    const token = this.options.github_token as string;
    const userAgent = this.options.user_agent as string;
    const previews = this.options.previews as string[];
    const opts: OctokitOptions = {};
    opts.log = (this.helpers.log as unknown) as Console;
    if (userAgent != null) opts.userAgent = userAgent;
    if (previews && Array.isArray(previews) && previews.length > 0)
      opts.previews = previews;

    const functionContext: AsyncFunctionArguments = {
      helpers: this.helpers,
      require: require,
      options: this.options,
    };
    if (token) {
      functionContext.github = getOctokit(token, opts);
    }
    const { run, path } = this.options as {
      run: string;
      path: string;
    };
    if (run) {
      const results = (await callAsyncFunction(
        functionContext,
        run
      )) as ITriggerResult;
      return results;
    } else if (path) {
      const scriptAbsolutePath = resolve(this.workflow.path, "../", path);
      const scriptPath = resolveCwd.silent(scriptAbsolutePath);
      if (scriptPath) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const scriptFunction = require(scriptPath);
        const scriptFunctionResult = scriptFunction(functionContext);
        if (isPromise(scriptFunctionResult)) {
          return await scriptFunctionResult;
        }
        return scriptFunctionResult;
      } else {
        throw new Error(`can not found the script path ${path}`);
      }
    } else {
      throw new Error(
        "Miss param run or path, you must provide one of run or path at least"
      );
    }
  }
}
