import Poll from "../poll";
import { getTriggerConstructorParams } from "./trigger.util";

test("poll trigger", async () => {
  const poll = new Poll(
    getTriggerConstructorParams({
      url: "https://jsonplaceholder.typicode.com/posts",
    })
  );
  const triggerResults = await poll.run();

  expect(triggerResults.items.length).toBe(100);
});
