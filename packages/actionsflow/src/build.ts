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
} from "./interfaces";

interface IBuildOptions {
  workflows?: string;
  dest?: string;
  base?: string;
  logLevel?: LogLevelDesc;
}
const build = async (options: IBuildOptions = {}): Promise<void> => {
  options = {
    workflows: "./workflows",
    dest: "./dist",
    base: process.cwd(),
    logLevel: "info",
    ...options,
  };
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
  const { base, workflows: workflowPath, dest } = options;
  const workflowsPath = path.resolve(base as string, workflowPath as string);
  const destPath = path.resolve(base as string, dest as string);
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
    src: workflowsPath,
    context,
  });
  // create workflow dest dir
  await fs.ensureDir(path.resolve(destPath, "workflows"));

  let needHandledWorkflows = workflows.filter(
    (item) => item.triggers.length > 0
  );

  //
  if (isWebhookEvent) {
    // only handle webhook event
    needHandledWorkflows = needHandledWorkflows.filter((item) => {
      const triggers = item.triggers;
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
        return { relativePath: item.relativePath, triggers: item.triggers };
      }),
      null,
      2
    )
  );

  const workflowTodos = [];
  let triggerIndex = 0;
  for (let i = 0; i < needHandledWorkflows.length; i++) {
    const workflow = needHandledWorkflows[i];
    const triggers = workflow.triggers || [];
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
    for (let j = 0; j < triggers.length; j++) {
      const trigger = triggers[j];
      let triggerResult: ITriggerResult = {
        id: `default_id_${j}`,
        items: [],
      };
      triggerResult = await runTrigger({
        trigger: {
          ...trigger,
          workflowRelativePath: workflow.relativePath,
        },
        context,
      });
      log.debug("triggerResult", triggerResult);

      if (triggerResult.items.length > 0) {
        // check is need to run workflowTodos
        for (let index = 0; index < triggerResult.items.length; index++) {
          const element = triggerResult.items[index];
          workflowTodo.triggers.push({
            id: `${triggerIndex}-${triggerResult.id}-${trigger.name}`,
            name: trigger.name,
            options: trigger.options,
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
