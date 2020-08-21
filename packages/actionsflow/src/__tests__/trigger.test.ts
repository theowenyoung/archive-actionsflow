import { run } from "../trigger";
import { remove } from "fs-extra";
beforeAll(async () => {
  await remove("./.cache");
});

afterEach(async () => {
  await remove("./.cache");
});

test("run trigger", async () => {
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
  // clear cache
  if (result.helpers && result.helpers.cache) {
    await result.helpers.cache.reset();
  }
  expect(result.items.length).toBe(2);
});
