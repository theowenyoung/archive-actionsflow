import Poll from "./poll";
import Rss from "./rss";
import Webhook from "./webhook";
import Script from "./script";
import TelegramBot from "@actionsflow/trigger-telegram_bot";
import Twitter from "@actionsflow/trigger-twitter";
import Slack from "@actionsflow/trigger-slack";
import AWSSNS from "@actionsflow/trigger-aws_sns";

import email from "./email";
export default {
  poll: Poll,
  rss: Rss,
  webhook: Webhook,
  script: Script,
  telegram_bot: TelegramBot,
  twitter: Twitter,
  slack: Slack,
  email,
  aws_sns: AWSSNS,
};
