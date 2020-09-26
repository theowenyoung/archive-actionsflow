import Parser from "rss-parser";
import {
  ITriggerClassType,
  ITriggerContructorParams,
  IHelpers,
  AnyObject,
  ITriggerOptions,
} from "actionsflow-interface";

export default class Rss implements ITriggerClassType {
  options: ITriggerOptions = {};
  helpers: IHelpers;
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
  }

  async run(): Promise<AnyObject[]> {
    const { url } = this.options as { url: string | string[] };
    let urls: string[] = [];

    if (Array.isArray(url)) {
      if (url.length === 0) {
        throw new Error("url must be provided one at lease");
      }
      urls = url;
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

        this.helpers.log.error(`fetch rss feed [${feedUrl}] error: `, e);
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
    return items;
  }
}
