import Poll from "./poll";
import Rss from "./rss";
import Webhook from "./webhook";
import Script from "./script";
import TelegramBot from "@actionsflow/trigger-telegram_bot";
import Twitter from "@actionsflow/trigger-twitter";
export default {
  poll: Poll,
  rss: Rss,
  webhook: Webhook,
  script: Script,
  telegram_bot: TelegramBot,
  twitter: Twitter,
};
