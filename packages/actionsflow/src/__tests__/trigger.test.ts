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

test("run trigger with  webhook", async () => {
  const result = await run({
    trigger: {
      name: "webhook",
      options: { deduplication_key: "update_id", force: true },
    },

    context: {
      github: {
        event: {},
      },
      secrets: {},
    },
    workflow: {
      path: path.resolve(__dirname, "./fixtures/workflows/webhook.yml"),
      relativePath: "webhook.yml",
      filename: "webhook",
      data: {
        on: {
          webhook: {
            deduplication_key: "update_id",
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
          name: "webhook",
          options: {
            deduplication_key: "update_id",
          },
        },
      ],
    },
    event: {
      type: "webhook",
      request: formatRequest({
        path: "/webhook/webhook/",
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect((result.items[0] as any).body.message.id).toBe("test");

  // clear cache
  if (result.helpers && result.helpers.cache) {
    await result.helpers.cache.reset();
  }
});
