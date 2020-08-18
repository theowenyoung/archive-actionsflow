import log from "../log";
import axios, { AxiosRequestConfig } from "axios";
import clonedeep from "lodash.clonedeep";
import get from "lodash.get";
import {
  ITriggerType,
  ITriggerRunFunction,
  IItem,
  ITriggerRunFunctionResult,
  TriggerName,
} from "../interfaces";

export default class Poll implements ITriggerType {
  name: TriggerName = "poll";
  async run({
    helpers,
    options,
  }: ITriggerRunFunction): Promise<ITriggerRunFunctionResult> {
    const {
      url,
      items_path,
      deduplication_key,
      every,
      ...requestOptions
    } = options as {
      url?: string;
      items_path?: string;
      deduplication_key?: string;
      every?: number;
    };
    const updateInterval = (every as number) || 5;

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

    const getItemKey = (item: IItem): string => {
      // TODO adapt every cases
      if (deduplication_key) {
        return item[deduplication_key] as string;
      }
      if (item.id) return item.id as string;
      if (item.guid) return item.guid as string;
      if (item.key) return item.key as string;
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
