import { getTasksByTriggerEvent } from "../task";
import { formatRequest } from "../event";
import path from "path";
const feedUrl = "https://hnrss.org/newest?points=300";
const feedOptions = {
  url: feedUrl,
};
test("get task by trigger event manual", () => {
  const tasks = getTasksByTriggerEvent({
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
  });
  expect(tasks[0].trigger.name).toEqual("rss");
});

test("get task by trigger event webhook", () => {
  const tasks = getTasksByTriggerEvent({
    event: {
      type: "webhook",
      request: formatRequest({
        path: "/telegram-bot/telegram_bot/webhook",
        method: "post",
      }),
    },
    workflows: [
      {
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
    ],
  });
  expect(tasks[0].trigger.name).toEqual("telegram_bot");
});
