import Webhook from "../webhook";
import { IWebhookRequest } from "actionsflow-interface";
import { getTriggerConstructorParams } from "./trigger.util";

test("webhook trigger", async () => {
  const webhook = new Webhook(
    getTriggerConstructorParams({ options: {}, name: "webhook" })
  );
  const request: IWebhookRequest = {
    path: "/",
    body: {
      id: "test123",
      title: "test webhook title",
    },
    method: "post",
    headers: {},
    query: {},
    params: {},
  };
  const triggerResults = await webhook.webhooks[0].handler.bind(webhook)(
    request
  );

  expect(triggerResults.items.length).toBe(1);
});
