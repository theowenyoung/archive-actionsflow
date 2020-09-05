import path from "path";
import { run } from "../trigger";
import { formatRequest } from "../event";
test("run trigger", async () => {
  const result = await run({
    trigger: {
      name: "rss",
      options: {
        url: "https://hnrss.org/newest?points=300",
        force: true,
      },
    },
    context: {
      github: {
        event: {},
      },
      secrets: {},
    },
    workflow: {
      relativePath: "test.yml",
      path: "",
      data: {},
      filename: "test",
      rawTriggers: [
        {
          name: "rss",
          options: {
            url: "https://hnrss.org/newest?points=300",
            force: true,
          },
        },
      ],
    },
    event: {
      type: "manual",
    },
  });

  expect(result.items.length).toBe(2);
  // clear cache
  if (result.helpers && result.helpers.cache) {
    await result.helpers.cache.reset();
  }
});

test("run trigger with telegram bot webhook", async () => {
  const result = await run({
    trigger: { name: "telegram_bot", options: { token: "test", force: true } },

    context: {
      github: {
        event: {},
      },
      secrets: {},
    },
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
    event: {
      type: "webhook",
      request: formatRequest({
        path: "/telegram-bot/telegram_bot/",
        method: "post",
        body: {
          update_id: "test",
          message: {
            id: "test",
          },
        },
      }),
    },
  });

  expect(result.items.length).toBe(1);
  expect(result.items[0].update_id).toBe("test");

  // clear cache
  if (result.helpers && result.helpers.cache) {
    await result.helpers.cache.reset();
  }
});
