import axios from "axios";
import TelegramBot from "../index";
jest.mock("axios");
import { getTriggerHelpers } from "actionsflow/dist/src/trigger";

const TELEGRAM_TOKEN = "test";

test("telegram bot trigger", async () => {
  const resp = {
    data: {
      ok: true,
      result: [
        {
          update_id: 791185170,
          message: {
            message_id: 5,
            from: {
              id: 1056059698,
              is_bot: false,
              first_name: "Owen",
              last_name: "Young",
              language_code: "en",
            },
            chat: {
              id: 1056059698,
              first_name: "Owen",
              last_name: "Young",
              type: "private",
            },
            date: 1597941277,
            text: "hello",
          },
        },
        {
          update_id: 791185171,
          message: {
            message_id: 6,
            from: {
              id: 1056059698,
              is_bot: false,
              first_name: "Owen",
              last_name: "Young",
              language_code: "en",
            },
            chat: {
              id: 1056059698,
              first_name: "Owen",
              last_name: "Young",
              type: "private",
            },
            date: 1597941280,
            photo: {},
          },
        },
      ],
    },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (axios as any).mockImplementation(() => Promise.resolve(resp));

  const telegramBot = new TelegramBot({
    helpers: getTriggerHelpers({
      name: "telegram_bot",
      workflowRelativePath: "telegram_bot.yml",
    }),
    options: {
      token: TELEGRAM_TOKEN,
      event: ["text", "photo"],
    },
    context: {
      github: {
        event: {},
      },
      secrets: {},
    },
  });
  const triggerResults = await telegramBot.run();

  expect(triggerResults.items.length).toBe(2);

  expect(telegramBot.getItemKey(triggerResults.items[0])).toBe(791185170);

  const telegramBot2 = new TelegramBot({
    helpers: getTriggerHelpers({
      name: "telegram_bot",
      workflowRelativePath: "telegram_bot.yml",
    }),
    options: {
      token: TELEGRAM_TOKEN,
      event: "photo",
    },
    context: {
      github: {
        event: {},
      },
      secrets: {},
    },
  });
  const triggerResults2 = await telegramBot2.run();
  expect(triggerResults2.items.length).toBe(1);

  expect(telegramBot2.getItemKey(triggerResults2.items[0])).toBe(791185171);
});
