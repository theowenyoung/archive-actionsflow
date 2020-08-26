import { run } from "../trigger";
test("run trigger", async () => {
  const result = await run({
    trigger: {
      name: "rss",
      options: {
        url: "https://hnrss.org/newest?points=300",
        force_update: true,
      },
      workflowRelativePath: "rss.yml",
    },
    context: {
      github: {
        event: {},
      },
      secrets: {},
    },
  });

  expect(result.items.length).toBe(2);
  // clear cache
  if (result.helpers && result.helpers.cache) {
    await result.helpers.cache.reset();
  }
});

test("run trigger without force update", async () => {
  process.env.DEFAULT_LOG_LEVEL = "debug";

  const result = await run({
    trigger: {
      name: "rss",
      options: {
        url: "https://hnrss.org/newest?points=300",
      },
      workflowRelativePath: "rss.yml",
    },
    context: {
      github: {
        event: {},
      },
      secrets: {},
    },
  });
  expect(result.items.length).toBe(0);
  // clear cache
  if (result.helpers && result.helpers.cache) {
    await result.helpers.cache.reset();
  }
});
