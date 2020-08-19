import log from "../log";
import axios, { AxiosRequestConfig } from "axios";
import clonedeep from "lodash.clonedeep";
import get from "lodash.get";
import {
  ITriggerClassType,
  ITriggerContructorParams,
  IItem,
  ITriggerRunFunctionResult,
  TriggerName,
  IHelpers,
  AnyObject,
} from "../interfaces";

export default class Poll implements ITriggerClassType {
  name: TriggerName = "poll";
  options: AnyObject = {};
  helpers: IHelpers;
  every = 5;
  shouldDeduplicate = true;
  getItemKey(item: IItem): string {
    // TODO adapt every cases
    const deduplication_key = this.options.deduplication_key;
    if (deduplication_key) {
      return item[deduplication_key as string] as string;
    }
    if (item.id) return item.id as string;
    if (item.guid) return item.guid as string;
    if (item.key) return item.key as string;
    return this.helpers.createContentDigest(item);
  }
  constructor({ helpers, options }: ITriggerContructorParams) {
    this.options = options;
    this.helpers = helpers;

    if (options.every) {
      this.every = options.every as number;
    }
  }
  async run(): Promise<ITriggerRunFunctionResult> {
    const { url, items_path, ...requestOptions } = this.options as {
      url?: string;
      items_path?: string;
      deduplication_key?: string;
      every?: number;
    };

    if (!url) {
      throw new Error("Miss param url!");
    }
    const items: IItem[] = [];
    const config: AxiosRequestConfig = {
      ...requestOptions,
      url: url as string,
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
    if (requestResult && requestResult.data) {
      const itemsArray: IItem[] = items_path
        ? get(requestResult.data, items_path)
        : requestResult.data;
      const deepClonedData = clonedeep(itemsArray);
      itemsArray.forEach((item) => {
        item.raw__body = deepClonedData;
        items.push(item);
      });
    }

    // if need
    return {
      items,
    };
  }
}
