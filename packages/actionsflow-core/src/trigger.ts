import chalk from "chalk";
import { createContentDigest, getCache, prepareBinaryData } from "./helpers";
import { LogLevelDesc } from "loglevel";
import path from "path";
import {
  AnyObject,
  ITriggerClassType,
  IHelpers,
  IWorkflow,
  ITriggerOptions,
  ITriggerContructorParams,
} from "actionsflow-interface";
import axios from "axios";
import { getWorkflow } from "./workflow";
import { getContext } from "./context";
import { Log, prefix, colors } from "./log";

export const getTriggerId = ({
  name,
  workflowRelativePath,
}: {
  name: string;
  workflowRelativePath: string;
}): string => {
  const triggerId = createContentDigest({
    name: name,
    path: workflowRelativePath,
  });
  return triggerId;
};
interface ITriggerHelpersOptions {
  name: string;
  workflowRelativePath: string;
  logLevel?: LogLevelDesc;
}
export const getTriggerHelpers = ({
  name,
  workflowRelativePath,
  logLevel,
}: ITriggerHelpersOptions): IHelpers => {
  const triggerId = getTriggerId({
    name: name,
    workflowRelativePath: workflowRelativePath,
  });
  const triggerLog = Log.getLogger(`Actionsflow-trigger [${name}]`);
  prefix.apply(triggerLog, {
    format(level, name, timestamp) {
      return `${chalk.gray(`[${timestamp}]`)} ${colors[level.toUpperCase()](
        level
      )} ${chalk.green(`${name}:`)}`;
    },
  });
  if (logLevel) {
    triggerLog.setDefaultLevel(logLevel);
  } else {
    triggerLog.setDefaultLevel("info");
  }
  const triggerHelpers = {
    createContentDigest,
    prepareBinaryData,
    cache: getCache(`trigger-${triggerId}`),
    log: triggerLog,
    axios: axios,
  };
  return triggerHelpers;
};
interface IGeneralTriggerOptions {
  every: number;
  shouldDeduplicate: boolean;
  getItemKey?: (item: AnyObject) => string;
  skipFirst: boolean;
  maxItemsCount: number;
  force: boolean;
  logLevel: LogLevelDesc;
}
export const getGeneralTriggerFinalOptions = (
  triggerInstance: ITriggerClassType,
  userOptions: ITriggerOptions
): IGeneralTriggerOptions => {
  const options: IGeneralTriggerOptions = {
    every: 1, // github actions every 5, here we can set 1,due to triggered by other event, like push
    shouldDeduplicate: true,
    getItemKey: (item: AnyObject): string => {
      return createContentDigest(item);
    },
    skipFirst: false,
    maxItemsCount: -1,
    force: false,
    logLevel: "info",
  };
  if (!userOptions.every === undefined) {
    options.every = Number(userOptions.every);
  }
  if (triggerInstance.shouldDeduplicate !== undefined) {
    options.shouldDeduplicate = Boolean(triggerInstance.shouldDeduplicate);
  }
  if (userOptions.shouldDeduplicate !== undefined) {
    // priorty
    options.shouldDeduplicate = Boolean(userOptions.shouldDeduplicate);
  }

  if (options.shouldDeduplicate) {
    if (triggerInstance.getItemKey) {
      options.getItemKey = triggerInstance.getItemKey.bind(triggerInstance);
    }
  }
  if (userOptions.skipFirst !== undefined) {
    options.skipFirst = Boolean(userOptions.skipFirst);
  }
  if (userOptions.maxItemsCount) {
    options.maxItemsCount = Number(userOptions.maxItemsCount);
  }
  if (userOptions.force !== undefined) {
    options.force = Boolean(userOptions.force);
  }
  if (userOptions.logLevel) {
    options.logLevel = userOptions.logLevel as LogLevelDesc;
  }

  return options;
};

export const getTriggerConstructorParams = async ({
  options,
  name,
  cwd,
  workflowPath,
}: {
  options: ITriggerOptions;
  name: string;
  cwd?: string;
  workflowPath: string;
}): Promise<ITriggerContructorParams> => {
  cwd = cwd || process.cwd();
  const relativePath = path.relative(
    path.resolve(cwd, "workflows"),
    workflowPath
  );

  return {
    options: options,
    helpers: getTriggerHelpers({
      name: name,
      workflowRelativePath: relativePath,
    }),
    workflow: (await getWorkflow({
      path: workflowPath,
      cwd: cwd,
      context: getContext(),
    })) as IWorkflow,
  };
};
