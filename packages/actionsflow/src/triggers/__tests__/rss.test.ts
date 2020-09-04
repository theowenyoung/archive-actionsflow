import Rss from "../rss";
import { getTriggerConstructorParams } from "./trigger.util";

test("rss trigger", async () => {
  const rss = new Rss(
    getTriggerConstructorParams({
      options: {
        url: "https://hnrss.org/newest?points=300",
        every: 10,
      },
      name: "rss",
    })
  );
  const triggerResults = await rss.run();

  expect(triggerResults.items.length).toBe(2);
});

test("rss trigger with event new_item_in_multiple_feeds", async () => {
  const rss = new Rss(
    getTriggerConstructorParams({
      options: {
        event: "new_item_in_multiple_feeds",
        urls: ["https://hnrss.org/newest?points=300"],
        every: 10,
      },
      name: "rss",
    })
  );
  const triggerResults = await rss.run();

  expect(triggerResults.items.length).toBe(2);
});
test("rss trigger without required param", async () => {
  const rss = new Rss(
    getTriggerConstructorParams({
      options: {},
      name: "rss",
    })
  );

  await expect(rss.run()).rejects.toEqual(new Error("Miss required param url"));
});
