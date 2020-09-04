import {
  ITask,
  ITriggerEvent,
  IWorkflow,
  IWebhookRequest,
} from "actionsflow-interface";
import log from "./log";
import { getTriggerWebhookBasePath, isMatchWebhookBasePath } from "./utils";

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
      const validWorkflow = workflows[i];
      validWorkflow.rawTriggers.length;
      for (let j = 0; j < validWorkflow.rawTriggers.length; j++) {
        const trigger = validWorkflow.rawTriggers[j];
        const webhookTriggerBasePath = getTriggerWebhookBasePath(
          validWorkflow.relativePath,
          trigger.name
        );

        if (isMatchWebhookBasePath(webhookPath, webhookTriggerBasePath)) {
          // final Trigger
          tasks.push({
            workflow: validWorkflow,
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
      const rawTriggers = workflow.rawTriggers || [];

      // manual run trigger
      for (let j = 0; j < rawTriggers.length; j++) {
        const rawTrigger = rawTriggers[j];

        tasks.push({
          workflow: workflow,
          trigger: rawTrigger,
          event: event,
        });
      }
    }
  }
  return tasks;
};
