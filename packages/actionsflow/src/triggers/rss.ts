import Parser from "rss-parser";
import {
  ITriggerClassType,
  ITriggerContructorParams,
  ITriggerResult,
  IHelpers,
  AnyObject,
} from "actionsflow-interface";
import log from "../log";

export default class Rss implements ITriggerClassType {
  options: AnyObject = {};
  helpers: IHelpers;
  shouldDeduplicate = true;
  getItemKey(item: AnyObject): string {
    // TODO adapt every cases
    if (item.guid) return item.guid as string;
    if (item.id) return item.id as string;
    return this.helpers.createContentDigest(item);
  }
  constructor({ helpers, options }: ITriggerContructorParams) {
    if (options) {
      this.options = options;
    }
    this.helpers = helpers;

    if (!options.event) {
      this.options.event = "new_item";
    }
  }

  async run(): Promise<ITriggerResult> {
    const { event, url } = this.options;
    let urls = [];

    if (event === "new_item_in_multiple_feeds") {
      const urlsParam = this.options.urls;
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
    const items: AnyObject[] = [];

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
        throw e;
      }
      // For now we just take the items and ignore everything else
      if (feed && feed.items) {
        feed.items.forEach((item) => {
          items.push(item);
        });
      }
    }

    // if need
    return {
      items,
    };
  }
}
