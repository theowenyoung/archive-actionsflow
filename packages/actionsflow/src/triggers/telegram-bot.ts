import log from "../log";
import axios, { AxiosRequestConfig } from "axios";
import {
  ITriggerClassType,
  ITriggerContructorParams,
  ITriggerRunFunctionResult,
  AnyObject,
  IHelpers,
} from "actionsflow-interface";

export default class TelegramBot implements ITriggerClassType {
  name = "telegram_bot";
  options: AnyObject = {};
  helpers: IHelpers;
  every = 5;
  shouldDeduplicate = true;
  getItemKey = (item: AnyObject): string => {
    if (item.update_id) return item.update_id as string;
    return this.helpers.createContentDigest(item);
  };
  constructor({ helpers, options }: ITriggerContructorParams) {
    if (options) {
      this.options = options;
    }
    this.helpers = helpers;
    if (options.every) {
      this.every = options.every as number;
    }
  }
  async run(): Promise<ITriggerRunFunctionResult> {
    const _messageTypes = [
      "text",
      "animation",
      "audio",
      "channel_chat_created",
      "contact",
      "delete_chat_photo",
      "dice",
      "document",
      "game",
      "group_chat_created",
      "invoice",
      "left_chat_member",
      "location",
      "migrate_from_chat_id",
      "migrate_to_chat_id",
      "new_chat_members",
      "new_chat_photo",
      "new_chat_title",
      "passport_data",
      "photo",
      "pinned_message",
      "poll",
      "sticker",
      "successful_payment",
      "supergroup_chat_created",
      "video",
      "video_note",
      "voice",
    ];
    const { token, event, ...requestOptions } = this.options as {
      token?: string;
      every?: number;
      event?: string;
    };
    let { events } = this.options as {
      events?: string[];
    };

    if (!token) {
      throw new Error("Miss param token!");
    }
    if (!events && event) {
      events = [event];
    }
    const items: AnyObject[] = [];
    const url = `https://api.telegram.org/bot${token}/getUpdates`;
    const config: AxiosRequestConfig = {
      ...requestOptions,
      url,
    };

    // get updates
    let requestResult;
    try {
      requestResult = await axios(config);
    } catch (e) {
      if (e.code === "ECONNREFUSED") {
        throw new Error(
          `It was not possible to connect to the URL. Please make sure the URL "${url}" it is valid!`
        );
      }

      log.error(`fetch ${url} error: `, e);
    }

    // For now we just take the items and ignore everything else
    if (
      requestResult &&
      requestResult.data &&
      Array.isArray(requestResult.data.result)
    ) {
      const itemsArray = requestResult.data.result;
      log.debug("telegram updates items:", JSON.stringify(itemsArray, null, 2));
      itemsArray.forEach((item: AnyObject) => {
        const message = item.message as {
          update_id: string;
          [key: string]: unknown;
        };
        // add update_id to message for unique key
        message.update_id = item.update_id as string;
        const messageType = _messageTypes.find((messageType) => {
          return message[messageType];
        });

        if (events) {
          if (messageType && events.includes(messageType)) {
            items.push(message);
          }
        } else {
          items.push(message);
        }
      });
    }

    // if need
    return {
      items,
    };
  }
}
