import { getWebhook } from "../webhook";
import path from "path";
import { IWorkflow } from "actionsflow-interface";
import { formatRequest, getWorkflow, getContext } from "../index";
test("get webhook", async () => {
  const webhook = getWebhook({
    request: formatRequest({
      path: "/webhook/webhook/webhook/id-test?id=1",
      method: "post",
      body: '{"update_id":"test"}',
    }),
    trigger: { name: "webhook", options: { token: "test" } },
    webhooks: [
      {
        path: "/webhook/:id",
        handler: async () => {
          return { items: [{ id: "test", title: "test title" }] };
        },
      },
    ],
    workflow: (await getWorkflow({
      path: path.resolve(__dirname, "./fixtures/workflows/webhook.yml"),
      cwd: path.resolve(__dirname, "./fixtures"),
      context: getContext(),
    })) as IWorkflow,
  });
  if (webhook) {
    expect(webhook.request.path as string).toBe("/webhook/id-test");
    expect(webhook.request.originPath as string).toBe("/webhook/id-test?id=1");
    expect(webhook.request.params.id as string).toBe("id-test");
    expect(webhook.request.method as string).toBe("post");
  } else {
    expect(webhook).toBe(undefined);
  }
});

test("get webhook not match", async () => {
  const webhook = getWebhook({
    request: formatRequest({
      path: "/webhook/webhook/webhook",
      method: "post",
      body: '{"update_id":"test"}',
    }),
    trigger: { name: "webhook", options: { token: "test" } },
    webhooks: [
      {
        path: "/webhook2",
        handler: async () => {
          return { items: [{ id: "test", title: "test title" }] };
        },
      },
    ],
    workflow: (await getWorkflow({
      path: path.resolve(__dirname, "./fixtures/workflows/webhook.yml"),
      cwd: path.resolve(__dirname, "./fixtures"),
      context: getContext(),
    })) as IWorkflow,
  });

  expect(webhook).toBe(undefined);
});
