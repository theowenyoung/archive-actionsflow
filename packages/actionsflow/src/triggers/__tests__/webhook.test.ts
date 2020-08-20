import Webhook from "../webhook";
import { getTriggerConstructorParams } from "./trigger.util";

test("webhook trigger", async () => {
  const webhook = new Webhook(getTriggerConstructorParams({}));
  const triggerResults = await webhook.run();

  expect(triggerResults.items.length).toBe(1);
});
