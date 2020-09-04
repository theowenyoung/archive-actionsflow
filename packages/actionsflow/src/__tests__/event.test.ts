import { getEventByContext } from "../event";

test("get event by context", () => {
  const context = {
    github: {
      event_name: "repository_dispatch",
      event: {
        action: "webhook",
        client_payload: {
          path: "/telegram-bot/telegram_bot/webhook",
          body: '{"update_id":"test"}',
        },
      },
    },
    secrets: {},
  };
  expect(getEventByContext(context)).toEqual({
    type: "webhook",
    request: {
      path: "/telegram-bot/telegram_bot/webhook",
      method: "post",
      headers: {},
      body: {
        update_id: "test",
      },
    },
  });
});
