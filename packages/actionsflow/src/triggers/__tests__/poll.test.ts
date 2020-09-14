import Poll from "../poll";
import { getTriggerHelpers } from "actionsflow-core";
import { IHelpers } from "actionsflow-interface";
import { AxiosStatic } from "axios";
const helpers: IHelpers = getTriggerHelpers({
  name: "poll",
  workflowRelativePath: "poll.yml",
});
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
  const axios = jest.fn();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axios.mockImplementation(() => Promise.resolve(resp));
  helpers.axios = (axios as unknown) as AxiosStatic;
  const constructionParams = await getTriggerConstructorParams({
    options: {
      url: "https://jsonplaceholder.typicode.com/posts",
    },
    name: "poll",
  });
  constructionParams.helpers = helpers;
  const poll = new Poll(constructionParams);
  const triggerResults = await poll.run();

  expect(triggerResults.length).toBe(2);
  const itemKey = poll.getItemKey(triggerResults[0]);
  expect(itemKey).toBe(1);
});

test("poll trigger with deduplicationKey", async () => {
  const axios = jest.fn();
  axios.mockImplementation(() => Promise.resolve(resp));
  helpers.axios = (axios as unknown) as AxiosStatic;
  const constructionParams = await getTriggerConstructorParams({
    options: {
      url: "https://jsonplaceholder.typicode.com/posts",
      deduplicationKey: "userId",
    },
    name: "poll",
  });
  constructionParams.helpers = helpers;
  const poll = new Poll(constructionParams);

  const triggerResults = await poll.run();

  expect(triggerResults.length).toBe(2);
  const itemKey = poll.getItemKey(triggerResults[0]);
  expect(itemKey).toBe(1);
});

test("poll trigger with deduplicationKey as key", async () => {
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
  const axios = jest.fn();
  axios.mockImplementation(() => Promise.resolve(resp2));
  helpers.axios = (axios as unknown) as AxiosStatic;
  const constructionParams = await getTriggerConstructorParams({
    options: {
      url: "https://jsonplaceholder.typicode.com/posts",
    },
    name: "poll",
  });
  constructionParams.helpers = helpers;
  const poll = new Poll(constructionParams);
  const triggerResults = await poll.run();

  expect(triggerResults.length).toBe(2);
  const itemKey = poll.getItemKey(triggerResults[0]);
  expect(itemKey).toBe(1);
});

test("poll trigger with deduplicationKey no found", async () => {
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
  const axios = jest.fn();
  axios.mockImplementation(() => Promise.resolve(resp2));
  helpers.axios = (axios as unknown) as AxiosStatic;
  const constructionParams = await getTriggerConstructorParams({
    options: {
      url: "https://jsonplaceholder.typicode.com/posts",
    },
    name: "poll",
  });
  constructionParams.helpers = helpers;
  const poll = new Poll(constructionParams);

  const triggerResults = await poll.run();

  expect(triggerResults.length).toBe(2);
  const itemKey = poll.getItemKey(triggerResults[0]);
  expect(itemKey).toBe("044d71aceeae5a9c202d197f4d216a6e");
});

test("poll trigger without required param", async () => {
  const poll = new Poll(
    await getTriggerConstructorParams({
      options: {},
      name: "poll",
    })
  );

  await expect(poll.run()).rejects.toEqual(new Error("Miss param url!"));
});
