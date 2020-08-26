import axios from "axios";
import Poll from "../poll";
jest.mock("axios");
import { getTriggerConstructorParams } from "./trigger.util";
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
test("poll trigger", async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (axios as any).mockImplementation(() => Promise.resolve(resp));

  const poll = new Poll(
    getTriggerConstructorParams({
      options: {
        url: "https://jsonplaceholder.typicode.com/posts",
        every: 10,
      },
      name: "poll",
    })
  );
  expect(poll.every).toBe(10);
  const triggerResults = await poll.run();

  expect(triggerResults.items.length).toBe(2);
  const itemKey = poll.getItemKey(triggerResults.items[0]);
  expect(itemKey).toBe(1);
});

test("poll trigger with deduplication_key", async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (axios as any).mockImplementation(() => Promise.resolve(resp));

  const poll = new Poll(
    getTriggerConstructorParams({
      options: {
        url: "https://jsonplaceholder.typicode.com/posts",
        deduplication_key: "userId",
      },
      name: "poll",
    })
  );
  const triggerResults = await poll.run();

  expect(triggerResults.items.length).toBe(2);
  const itemKey = poll.getItemKey(triggerResults.items[0]);
  expect(itemKey).toBe(1);
});

test("poll trigger with deduplication_key as key", async () => {
  const resp2 = {
    data: [
      {
        userId: 1,
        key: 1,
        title:
          "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        body:
          "quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto",
      },
      {
        userId: 1,
        key: 2,
        title: "qui est esse",
        body:
          "est rerum tempore vitae sequi sint nihil reprehenderit dolor beatae ea dolores neque fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis qui aperiam non debitis possimus qui neque nisi nulla",
      },
    ],
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (axios as any).mockImplementation(() => Promise.resolve(resp2));

  const poll = new Poll(
    getTriggerConstructorParams({
      options: {
        url: "https://jsonplaceholder.typicode.com/posts",
      },
      name: "poll",
    })
  );
  const triggerResults = await poll.run();

  expect(triggerResults.items.length).toBe(2);
  const itemKey = poll.getItemKey(triggerResults.items[0]);
  expect(itemKey).toBe(1);
});

test("poll trigger with deduplication_key no found", async () => {
  const resp2 = {
    data: [
      {
        userId: 1,
        title:
          "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        body:
          "quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto",
      },
      {
        userId: 1,
        title: "qui est esse",
        body:
          "est rerum tempore vitae sequi sint nihil reprehenderit dolor beatae ea dolores neque fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis qui aperiam non debitis possimus qui neque nisi nulla",
      },
    ],
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (axios as any).mockImplementation(() => Promise.resolve(resp2));

  const poll = new Poll(
    getTriggerConstructorParams({
      options: {
        url: "https://jsonplaceholder.typicode.com/posts",
      },
      name: "poll",
    })
  );
  const triggerResults = await poll.run();

  expect(triggerResults.items.length).toBe(2);
  const itemKey = poll.getItemKey(triggerResults.items[0]);
  expect(itemKey).toBe("044d71aceeae5a9c202d197f4d216a6e");
});

test("poll trigger without required param", async () => {
  const poll = new Poll(
    getTriggerConstructorParams({
      options: {},
      name: "poll",
    })
  );

  await expect(poll.run()).rejects.toEqual(new Error("Miss param url!"));
});
