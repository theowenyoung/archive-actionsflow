import Rss from "../rss";
import { getTriggerConstructorParams } from "./trigger.util";

test("rss trigger", async () => {
  const rss = new Rss(
    getTriggerConstructorParams({
      url: "https://hnrss.org/newest?points=300",
    })
  );
  const triggerResults = await rss.run();

  expect(triggerResults.items.length).toBe(1);
});
