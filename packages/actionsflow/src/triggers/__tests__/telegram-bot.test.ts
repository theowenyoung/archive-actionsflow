import axios from "axios";
import TelegramBot from "../telegram-bot";
jest.mock("axios");
import { getTriggerConstructorParams } from "./trigger.util";
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
            text: "world",
          },
        },
      ],
    },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (axios as any).mockImplementation(() => Promise.resolve(resp));

  const telegramBot = new TelegramBot(
    getTriggerConstructorParams({
      token: TELEGRAM_TOKEN,
    })
  );
  const triggerResults = await telegramBot.run();

  expect(triggerResults.items.length).toBe(2);
});
