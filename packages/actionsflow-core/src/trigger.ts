import chalk from "chalk";
import { createContentDigest, getCache, formatBinary } from "./helpers";
import { LogLevelDesc } from "loglevel";
import path from "path";
import {
  AnyObject,
  ITriggerClassType,
  IHelpers,
  IWorkflow,
  ITriggerGeneralConfigOptions,
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
    formatBinary,
    cache: getCache(`trigger-${triggerId}`),
    log: triggerLog,
    axios: axios,
  };
  return triggerHelpers;
};
interface IGeneralTriggerOptions extends ITriggerGeneralConfigOptions {
  every: number;
  shouldDeduplicate: boolean;
  getItemKey: (item: AnyObject) => string;
  skipFirst: boolean;
  force: boolean;
  logLevel: LogLevelDesc;
  active: boolean;
  continueOnError: boolean;
}
export const getGeneralTriggerFinalOptions = (
  triggerInstance: ITriggerClassType,
  triggerOptions: ITriggerOptions
): IGeneralTriggerOptions => {
  const instanceConfig = triggerInstance.config || {};
  let userOptions: ITriggerGeneralConfigOptions = {};
  if (triggerOptions && triggerOptions.config) {
    userOptions = triggerOptions.config;
  }
  const options: IGeneralTriggerOptions = {
    every: 0, // github actions every 5, here we can set 0,due to triggered by other event, like push
    shouldDeduplicate: true,
    getItemKey: (item: AnyObject): string => {
      return createContentDigest(item);
    },
    skipFirst: false,
    force: false,
    logLevel: "info",
    active: true,
    continueOnError: false,
    ...instanceConfig,
    ...userOptions,
  };

  if (options.shouldDeduplicate) {
    if (triggerInstance.getItemKey) {
      options.getItemKey = triggerInstance.getItemKey.bind(triggerInstance);
    }
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
