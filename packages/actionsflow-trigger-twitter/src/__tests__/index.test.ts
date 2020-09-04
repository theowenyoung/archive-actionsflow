import Trigger from "../index";
import { getTriggerHelpers } from "actionsflow/dist/src/trigger";

test("run trigger", async () => {
  const trigger = new Trigger({
    context: {
      github: {
        event: {},
      },
      secrets: {},
    },
    options: {
      params1: "value1",
      every: 10,
    },
    helpers: getTriggerHelpers({
      name: "twitter",
      workflowRelativePath: "twitter.yml",
    }),
  });
  await expect(trigger.run()).rejects.toEqual(
    new Error("Twit config must include `consumer_key` when using user auth.")
  );
});
