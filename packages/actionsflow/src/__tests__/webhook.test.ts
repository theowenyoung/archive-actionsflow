import { getWebhook } from "../webhook";
import path from "path";
import { formatRequest } from "../event";
test("get webhook", () => {
  const webhook = getWebhook({
    request: formatRequest({
      path: "/telegram-bot/telegram_bot/webhook/id-test?id=1",
      method: "post",
      body: '{"update_id":"test"}',
    }),
    trigger: { name: "telegram_bot", options: { token: "test" } },
    webhooks: [
      {
        path: "/webhook/:id",
        handler: async () => {
          return { items: [{ id: "test", title: "test title" }] };
        },
      },
    ],
    workflow: {
      path: path.resolve(__dirname, "./fixtures/workflows/telegram-bot.yml"),
      relativePath: "telegram-bot.yml",
      filename: "telegram-bot",
      data: {
        on: {
          telegram_bot: {
            token: "test",
          },
        },
        jobs: {
          job1: {
            steps: [
              {
                run: "echo ${{ on.rss.outputs.title }}",
              },
            ],
          },
        },
      },
      rawTriggers: [
        {
          name: "telegram_bot",
          options: {
            token: "test",
          },
        },
      ],
    },
  });
  if (webhook) {
    console.log("webhook.request", webhook.request);

    expect(webhook.request.path as string).toBe("/webhook/id-test");
    expect(webhook.request.originPath as string).toBe("/webhook/id-test?id=1");
    expect(webhook.request.params.id as string).toBe("id-test");
    expect(webhook.request.method as string).toBe("post");
  } else {
    expect(webhook).toBe(undefined);
  }
});

test("get webhook not match", () => {
  const webhook = getWebhook({
    request: formatRequest({
      path: "/telegram-bot/telegram_bot/webhook",
      method: "post",
      body: '{"update_id":"test"}',
    }),
    trigger: { name: "telegram_bot", options: { token: "test" } },
    webhooks: [
      {
        path: "/webhook2",
        handler: async () => {
          return { items: [{ id: "test", title: "test title" }] };
        },
      },
    ],
    workflow: {
      path: path.resolve(__dirname, "./fixtures/workflows/telegram-bot.yml"),
      relativePath: "telegram-bot.yml",
      filename: "telegram-bot",
      data: {
        on: {
          telegram_bot: {
            token: "test",
          },
        },
        jobs: {
          job1: {
            steps: [
              {
                run: "echo ${{ on.rss.outputs.title }}",
              },
            ],
          },
        },
      },
      rawTriggers: [
        {
          name: "telegram_bot",
          options: {
            token: "test",
          },
        },
      ],
    },
  });

  expect(webhook).toBe(undefined);
});
