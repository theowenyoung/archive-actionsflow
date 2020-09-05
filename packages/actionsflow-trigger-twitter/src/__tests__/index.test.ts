import Trigger from "../index";
import { getTriggerHelpers, getWorkflow, getContext } from "actionsflow";
import { IWorkflow } from "actionsflow-interface";
import path from "path";
test("run trigger", async () => {
  const trigger = new Trigger({
    context: getContext(),
    options: {
      params1: "value1",
      every: 10,
    },
    helpers: getTriggerHelpers({
      name: "twitter",
      workflowRelativePath: "workflow.yml",
    }),
    workflow: (await getWorkflow({
      path: path.resolve(__dirname, "fixtures/workflows/workflow.yml"),
      cwd: path.resolve(__dirname, "fixtures"),
      context: getContext(),
    })) as IWorkflow,
  });
  await expect(trigger.run()).rejects.toEqual(
    new Error("Twit config must include `consumer_key` when using user auth.")
  );
});
