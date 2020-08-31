import "./env";
import path from "path";
import fs from "fs-extra";
import {
  buildSingleWorkflow,
  getWorkflows,
  buildNativeEvent,
  buildNativeSecrets,
} from "./workflow";
import { run as runTrigger } from "./trigger";
import log from "./log";
import { LogLevelDesc } from "loglevel";
import {
  ITriggerContext,
  ITriggerResult,
  ITrigger,
  IWorkflow,
  IGithub,
} from "actionsflow-interface";

interface IBuildOptions {
  dest?: string;
  cwd?: string;
  include?: string[];
  exclude?: string[];
  force?: boolean;
  logLevel?: LogLevelDesc;
}
const build = async (options: IBuildOptions = {}): Promise<void> => {
  options = {
    dest: "./dist",
    cwd: process.cwd(),
    include: [],
    exclude: [],
    logLevel: "info",
    force: false,
    ...options,
  };
  // log.debug("build: options", options);
  if (options.logLevel) {
    log.setLevel(options.logLevel);
  }
  // clean dist

  let githubObj: IGithub = {
    event: {},
  };
  try {
    if (process.env.JSON_GITHUB) {
      githubObj = JSON.parse(process.env.JSON_GITHUB);
    }
    if (!githubObj) {
      githubObj = { event: {} };
    }
  } catch (error) {
    log.warn("parse enviroment variable JSON_GITHUB error:", error);
  }
  const { cwd, dest, include, exclude, force } = options;
  const destPath = path.resolve(cwd as string, dest as string);
  log.debug("destPath:", destPath);

  let secretObj: Record<string, string> = {};
  try {
    if (process.env.JSON_SECRETS) {
      secretObj = JSON.parse(process.env.JSON_SECRETS);
    }
    if (!secretObj) {
      secretObj = {};
    }
  } catch (error) {
    log.warn("parse enviroment variable JSON_SECRETS error:", error);
  }
  const context: ITriggerContext = {
    secrets: secretObj,
    github: githubObj,
  };
  // build native event
  await buildNativeEvent({
    dest: destPath,
    github: githubObj,
  });
  // build secret

  await buildNativeSecrets({
    dest: destPath,
    secrets: secretObj,
  });
  // if webhook event
  const isWebhookEvent = githubObj.event_name === "repository_dispatch";
  log.debug("isWebhookEvent: ", isWebhookEvent);
  const workflows = await getWorkflows({
    context,
    cwd: cwd as string,
    include,
    exclude,
  });
  // create workflow dest dir
  await fs.ensureDir(path.resolve(destPath, "workflows"));
  let needHandledWorkflows = workflows.filter(
    (item) => item.rawTriggers.length > 0
  );

  //
  if (isWebhookEvent) {
    // only handle webhook event
    needHandledWorkflows = needHandledWorkflows.filter((item) => {
      const triggers = item.rawTriggers;
      let isMatchedWebhookEvent = false;
      for (let index = 0; index < triggers.length; index++) {
        const trigger = triggers[index];
        if (trigger.name === "webhook") {
          if (trigger.options && trigger.options.event) {
            // specific evetn
            if (trigger.options.event === githubObj.event.action) {
              isMatchedWebhookEvent = true;
            }
          } else {
            isMatchedWebhookEvent = true;
          }
        }
      }
      return isMatchedWebhookEvent;
    });
  }
  log.debug(
    "needHandledWorkflows",
    JSON.stringify(
      needHandledWorkflows.map((item) => {
        return {
          relativePath: item.relativePath,
          rawTriggers: item.rawTriggers,
        };
      }),
      null,
      2
    )
  );

  const workflowTodos = [];
  let triggerIndex = 0;
  for (let i = 0; i < needHandledWorkflows.length; i++) {
    const workflow = needHandledWorkflows[i];
    const rawTriggers = workflow.rawTriggers || [];
    const workflowTodo: {
      dest: string;
      workflow: IWorkflow;
      context: ITriggerContext;
      triggers: ITrigger[];
    } = {
      dest: destPath,
      workflow: workflow,
      context: context,
      triggers: [],
    };
    // manual run trigger
    for (let j = 0; j < rawTriggers.length; j++) {
      const rawTrigger = rawTriggers[j];
      if (force) {
        if (rawTrigger.options) {
          rawTrigger.options.force = true;
        } else {
          rawTrigger.options = { force: true };
        }
      }
      let triggerResult: ITriggerResult = {
        id: `default_id_${j}`,
        items: [],
      };
      triggerResult = await runTrigger({
        trigger: {
          ...rawTrigger,
          workflowRelativePath: workflow.relativePath,
        },
        context,
      });

      if (triggerResult.items.length > 0) {
        // check is need to run workflowTodos
        for (let index = 0; index < triggerResult.items.length; index++) {
          const element = triggerResult.items[index];
          workflowTodo.triggers.push({
            id: `${triggerIndex}-${triggerResult.id}-${rawTrigger.name}`,
            name: rawTrigger.name,
            options: rawTrigger.options,
            payload: element,
          });
          triggerIndex++;
        }
      }
    }
    workflowTodos.push(workflowTodo);
  }
  for (let index = 0; index < workflowTodos.length; index++) {
    const element = workflowTodos[index];
    if (element.triggers.length > 0) {
      await buildSingleWorkflow(element);
    }
  }
};

export default build;
