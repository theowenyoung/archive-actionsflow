import path from "path";
import { run } from "../trigger";
import { IWorkflow } from "actionsflow-interface";
import { formatRequest, getWorkflow, getContext } from "../index";
test("run trigger", async () => {
  const result = await run({
    trigger: {
      name: "rss",
      options: {
        url: "https://hnrss.org/newest?points=300",
        force: true,
      },
    },

    workflow: {
      relativePath: "test.yml",
      path: "",
      data: {},
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

    workflow: (await getWorkflow({
      path: path.resolve(__dirname, "./fixtures/workflows/webhook.yml"),
      cwd: path.resolve(__dirname, "./fixtures"),
      context: getContext(),
    })) as IWorkflow,
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
