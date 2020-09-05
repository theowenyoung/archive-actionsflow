import Webhook from "../webhook";
import { IWebhookRequest } from "actionsflow-interface";
import { getTriggerConstructorParams } from "./trigger.util";
import { formatRequest } from "../../event";

test("webhook trigger", async () => {
  const webhook = new Webhook(
    await getTriggerConstructorParams({ options: {}, name: "webhook" })
  );
  const requestPayload = formatRequest({
    path: "/",
    body: {
      id: "test123",
      title: "test webhook title",
    },
    method: "post",
    headers: {},
  });
  const request: IWebhookRequest = {
    ...requestPayload,
    params: {},
  };

  const triggerResults = await webhook.webhooks[0].handler.bind(webhook)(
    request
  );

  expect(triggerResults.items.length).toBe(1);
});
