import Parser from "rss-parser";
import {
  ITriggerClassType,
  ITriggerRunFunction,
  IItem,
  TriggerName,
  ITriggerRunFunctionResult,
} from "../interfaces";
import log from "../log";

export default class Rss implements ITriggerClassType {
  id: TriggerName = "rss";
  async run({
    helpers,
    options,
  }: ITriggerRunFunction): Promise<ITriggerRunFunctionResult> {
    const event = options.event || "new_item";
    const url = options.url;
    const updateInterval: number = (options.every as number) || 5;
    let urls = [];

    if (event === "new_item_in_multiple_feeds") {
      const urlsParam = options.urls;
      if (!urlsParam) {
        throw new Error("Miss param urls");
      }
      if (typeof urlsParam === "string") {
        urls = [urlsParam];
      } else if (Array.isArray(urlsParam)) {
        urls = urlsParam;
      } else {
        throw new Error("Param urls is invalid!");
      }
    } else {
      if (!url) {
        throw new Error("Miss required param url");
      }
      urls = [url];
    }
    const items: IItem[] = [];

    for (let index = 0; index < urls.length; index++) {
      const feedUrl = urls[index];
      // get updates
      const parser = new Parser();

      let feed;
      try {
        feed = await parser.parseURL(feedUrl);
      } catch (e) {
        if (e.code === "ECONNREFUSED") {
          throw new Error(
            `It was not possible to connect to the URL. Please make sure the URL "${url}" it is valid!`
          );
        }

        log.error("fetch rss feed error: ", e);
      }
      // For now we just take the items and ignore everything else
      if (feed && feed.items) {
        feed.items.forEach((item) => {
          items.push(item);
        });
      }
    }

    const getItemKey = (item: IItem): string => {
      // TODO adapt every cases
      if (item.guid) return item.guid as string;
      if (item.id) return item.id as string;
      return helpers.createContentDigest(item);
    };

    // if need
    return {
      shouldDeduplicate: true,
      updateInterval: updateInterval,
      items,
      getItemKey,
    };
  }
}
