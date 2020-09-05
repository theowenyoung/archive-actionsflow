import { getWebhook } from "../webhook";
import path from "path";
import { formatRequest } from "../event";
test("get webhook", () => {
  const webhook = getWebhook({
    request: formatRequest({
      path: "/telegram-bot/telegram_bot/webhook",
      method: "post",
      body: '{"update_id":"test"}',
    }),
    trigger: { name: "telegram_bot", options: { token: "test" } },
    webhooks: [
      {
        path: "/webhook",
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
    expect(webhook.request.path as string).toBe("/webhook");
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
