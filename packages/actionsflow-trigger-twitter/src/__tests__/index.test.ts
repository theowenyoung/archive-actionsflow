import Trigger from "../index";
import { getTriggerOptions } from "actionsflow/dist/src/trigger";

test("run trigger", async () => {
  const trigger = new Trigger(
    getTriggerOptions({
      trigger: {
        name: "twitter",
        workflowRelativePath: "test.yml",
        options: {
          params1: "value1",
          every: 10,
        },
      },
      context: {
        github: {
          event: {},
        },
        secrets: {},
      },
    })
  );
  expect(trigger.every).toBe(10);
  const triggerResults = await trigger.run();
  expect(triggerResults.items.length).toBe(1);
});
