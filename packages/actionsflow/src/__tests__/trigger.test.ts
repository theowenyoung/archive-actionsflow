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
