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
  await expect(trigger.run()).rejects.toEqual(
    new Error("Twit config must include `consumer_key` when using user auth.")
  );
});
