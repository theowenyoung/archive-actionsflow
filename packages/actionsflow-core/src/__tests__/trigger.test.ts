import { getTriggerId, getRawTriggers, getTriggerHelpers } from "../trigger";

test("get trigger id", () => {
  expect(
    getTriggerId({
      name: "test",
      workflowRelativePath: "test.yml",
    })
  ).toBe("368459a7f7a75d9648fe2dea2322c00d");
});

test("get raw trigger", () => {
  expect(
    getRawTriggers({
      on: {
        rss: {
          url: "test",
        },
        poll: {
          url: "test2",
        },
      },
    })
  ).toEqual([
    {
      name: "rss",
      options: { url: "test" },
    },
    {
      name: "poll",
      options: { url: "test2" },
    },
  ]);
});

test("getTriggerHelpers", async () => {
  const helpers = getTriggerHelpers({
    name: "rss",
    workflowRelativePath: "test.yml",
  });
  expect(helpers).toHaveProperty("cache");
  expect(helpers).toHaveProperty("createContentDigest");
  expect(helpers).toHaveProperty("log");
  await helpers.cache.reset();
});
