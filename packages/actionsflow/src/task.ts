import {
  ITask,
  ITriggerEvent,
  IWorkflow,
  IWebhookRequest,
} from "actionsflow-interface";
import {
  getRawTriggers,
  log,
  getTriggerWebhookBasePath,
  isMatchWebhookBasePath,
} from "actionsflow-core";
import { getSupportedTriggers } from "./trigger";
export const getTasksByTriggerEvent = ({
  event,
  workflows,
}: {
  event: ITriggerEvent;
  workflows: IWorkflow[];
}): ITask[] => {
  const tasks: ITask[] = [];
  if (event.type === "webhook") {
    const request = event.request as IWebhookRequest;
    const webhookPath = request.path;
    for (let i = 0; i < workflows.length; i++) {
      const workflow = workflows[i];
      const rawTriggers = getRawTriggers(workflow.data);
      // get support and active triggers
      const supportedTriggers = getSupportedTriggers(rawTriggers);
      for (let j = 0; j < supportedTriggers.length; j++) {
        const trigger = supportedTriggers[j];
        const webhookTriggerBasePath = getTriggerWebhookBasePath(
          workflow.relativePath,
          trigger.name
        );

        if (isMatchWebhookBasePath(webhookPath, webhookTriggerBasePath)) {
          // final Trigger
          tasks.push({
            workflow: workflow,
            trigger: trigger,
            event: event,
          });
          break;
        }
      }
    }
    if (tasks.length === 0) {
      log.info(
        `The webhook request path [${webhookPath}] does not match any workflow triggers, Actionsflow will skip to continue build workflows this time`
      );
    }
  } else {
    // manual
    for (let i = 0; i < workflows.length; i++) {
      const workflow = workflows[i];
      const rawTriggers = getRawTriggers(workflow.data);
      // get support and active triggers
      const supportedTriggers = getSupportedTriggers(rawTriggers);
      // manual run trigger
      for (let j = 0; j < supportedTriggers.length; j++) {
        const trigger = supportedTriggers[j];

        tasks.push({
          workflow: workflow,
          trigger: trigger,
          event: event,
        });
      }
    }
  }
  return tasks;
};
