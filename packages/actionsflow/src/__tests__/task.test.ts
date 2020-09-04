import { getTasksByTriggerEvent } from "../task";
import path from "path";
const feedUrl = "https://hnrss.org/newest?points=300";
const feedOptions = {
  url: feedUrl,
};
test("get task by trigger event manual", () => {
  expect(
    getTasksByTriggerEvent({
      event: {
        type: "manual",
      },
      workflows: [
        {
          path: path.resolve(__dirname, "./fixtures/workflows/rss2.yml"),
          relativePath: "rss2.yml",
          filename: "rss2",
          data: {
            on: {
              rss: {
                url: feedUrl,
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
              name: "rss",
              options: feedOptions,
            },
          ],
        },
      ],
    })
  ).toEqual([
    {
      event: { type: "manual" },
      trigger: {
        name: "rss",
        options: { url: "https://hnrss.org/newest?points=300" },
      },
      workflow: {
        data: {
          jobs: {
            job1: { steps: [{ run: "echo ${{ on.rss.outputs.title }}" }] },
          },
          on: { rss: { url: "https://hnrss.org/newest?points=300" } },
        },
        filename: "rss2",
        path:
          "/Users/owenyoung/project/actionsflow/packages/actionsflow/src/__tests__/fixtures/workflows/rss2.yml",
        rawTriggers: [
          {
            name: "rss",
            options: { url: "https://hnrss.org/newest?points=300" },
          },
        ],
        relativePath: "rss2.yml",
      },
    },
  ]);
});

test("get task by trigger event webhook", () => {
  expect(
    getTasksByTriggerEvent({
      event: {
        type: "webhook",
        request: {
          path: "/telegram-bot/telegram_bot/webhook",
          method: "post",
          headers: {},
          body: {
            update_id: "test",
          },
        },
      },
      workflows: [
        {
          path: path.resolve(
            __dirname,
            "./fixtures/workflows/telegram-bot.yml"
          ),
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
      ],
    })
  ).toEqual([
    {
      event: {
        request: {
          body: { update_id: "test" },
          headers: {},
          method: "post",
          path: "/telegram-bot/telegram_bot/webhook",
        },
        type: "webhook",
      },
      trigger: { name: "telegram_bot", options: { token: "test" } },
      workflow: {
        data: {
          jobs: {
            job1: { steps: [{ run: "echo ${{ on.rss.outputs.title }}" }] },
          },
          on: { telegram_bot: { token: "test" } },
        },
        filename: "telegram-bot",
        path:
          "/Users/owenyoung/project/actionsflow/packages/actionsflow/src/__tests__/fixtures/workflows/telegram-bot.yml",
        rawTriggers: [{ name: "telegram_bot", options: { token: "test" } }],
        relativePath: "telegram-bot.yml",
      },
    },
  ]);
});
