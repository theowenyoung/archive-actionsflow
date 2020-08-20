import axios from "axios";
import Poll from "../poll";
jest.mock("axios");
import { getTriggerConstructorParams } from "./trigger.util";

test("poll trigger", async () => {
  const resp = {
    data: [
      {
        userId: 1,
        id: 1,
        title:
          "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        body:
          "quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto",
      },
      {
        userId: 1,
        id: 2,
        title: "qui est esse",
        body:
          "est rerum tempore vitae sequi sint nihil reprehenderit dolor beatae ea dolores neque fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis qui aperiam non debitis possimus qui neque nisi nulla",
      },
    ],
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (axios as any).mockImplementation(() => Promise.resolve(resp));

  const poll = new Poll(
    getTriggerConstructorParams({
      url: "https://jsonplaceholder.typicode.com/posts",
    })
  );
  const triggerResults = await poll.run();

  expect(triggerResults.items.length).toBe(2);
});
