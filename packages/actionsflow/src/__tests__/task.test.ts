import { getTasksByTriggerEvent } from "../task";
import { formatRequest, getWorkflow, getContext } from "actionsflow-core";
import path from "path";
import { IWorkflow } from "actionsflow-interface";

test("get task by trigger event manual", async () => {
  const tasks = getTasksByTriggerEvent({
    event: {
      type: "manual",
    },
    workflows: [
      (await getWorkflow({
        path: path.resolve(__dirname, "./fixtures/workflows/rss.yml"),
        cwd: path.resolve(__dirname, "./fixtures"),
        context: getContext(),
      })) as IWorkflow,
    ],
  });
  expect(tasks[0].trigger.name).toEqual("rss");
});

test("get task by trigger event webhook", async () => {
  const tasks = getTasksByTriggerEvent({
    event: {
      type: "webhook",
      request: formatRequest({
        path: "/webhook/webhook",
        method: "post",
      }),
    },
    workflows: [
      (await getWorkflow({
        path: path.resolve(__dirname, "./fixtures/workflows/webhook.yml"),
        cwd: path.resolve(__dirname, "./fixtures"),
        context: getContext(),
      })) as IWorkflow,
    ],
  });
  expect(tasks.length).toBe(1);

  expect(tasks[0].trigger.name).toEqual("webhook");
});
