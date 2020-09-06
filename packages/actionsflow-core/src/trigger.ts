import chalk from "chalk";
import { createContentDigest, getCache } from "./helpers";
import { LogLevelDesc } from "loglevel";
import {
  AnyObject,
  ITrigger,
  ITriggerClassType,
  IHelpers,
} from "actionsflow-interface";
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
    cache: getCache(`trigger-${triggerId}`),
    log: triggerLog,
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
  userOptions: AnyObject
): IGeneralTriggerOptions => {
  const options: IGeneralTriggerOptions = {
    every: 5,
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
  if (userOptions.should_deduplicate !== undefined) {
    // priorty
    options.shouldDeduplicate = Boolean(userOptions.should_deduplicate);
  }

  if (options.shouldDeduplicate) {
    if (triggerInstance.getItemKey) {
      options.getItemKey = triggerInstance.getItemKey.bind(triggerInstance);
    }
  }
  if (userOptions.skip_first !== undefined) {
    options.skipFirst = Boolean(userOptions.skip_first);
  }
  if (userOptions.max_items_count) {
    options.maxItemsCount = Number(userOptions.max_items_count);
  }
  if (userOptions.force !== undefined) {
    options.force = Boolean(userOptions.force);
  }
  if (userOptions.log_level) {
    options.logLevel = userOptions.log_level as LogLevelDesc;
  }

  return options;
};
/**
 * get raw triggers from workflow data
 * @param doc
 */
export const getRawTriggers = (doc: AnyObject): ITrigger[] => {
  const triggers = [];
  if (doc && doc.on) {
    const onObj = doc.on as Record<string, Record<string, unknown>>;
    const keys = Object.keys(onObj);

    for (let index = 0; index < keys.length; index++) {
      const key = keys[index] as string;
      let options = {};
      if (onObj && onObj[key]) {
        options = onObj[key];
      }
      triggers.push({
        name: key,
        options: options,
      });
    }
  }
  return triggers;
};
