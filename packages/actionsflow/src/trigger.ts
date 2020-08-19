import * as Triggers from "./triggers";
import { createContentDigest, getCache } from "./helpers";
import log from "./log";
import {
  ITriggerContext,
  ITriggerResult,
  AnyObject,
  ITriggerClassTypeConstructable,
} from "actionsflow-interface";
const MAX_CACHE_KEYS_COUNT = 5000;
interface ITriggerOptions {
  trigger: {
    name: string;
    options: Record<string, unknown>;
    workflowRelativePath: string;
  };
  context: ITriggerContext;
}

export const run = async ({
  trigger,
  context,
}: ITriggerOptions): Promise<ITriggerResult> => {
  log.debug("trigger:", trigger);
  // get unique id
  let triggerId = "";
  if (trigger && trigger.options && trigger.options.id) {
    triggerId = trigger.options.id as string;
  } else {
    triggerId = createContentDigest({
      name: trigger.name,
      path: trigger.workflowRelativePath,
    });
  }
  const finalResult: ITriggerResult = {
    id: triggerId,
    items: [],
  };

  const AllTriggers = Triggers as Record<
    string,
    ITriggerClassTypeConstructable
  >;
  const triggersKeys = Object.keys(AllTriggers);
  const TriggerMap: Record<string, ITriggerClassTypeConstructable> = {};
  triggersKeys.forEach((triggerKey) => {
    const triggerInstance = new AllTriggers[triggerKey]({
      options: {},
      context: context,
      helpers: { createContentDigest, cache: getCache(`trigger-temp`) },
    });
    TriggerMap[triggerInstance.name] = AllTriggers[triggerKey];
  });

  if (TriggerMap[trigger.name]) {
    const triggerHelpers = {
      createContentDigest,
      cache: getCache(`trigger-${triggerId}`),
    };
    const triggerOptions = {
      helpers: triggerHelpers,
      options: trigger.options,
      context: context,
    };
    const Trigger = TriggerMap[trigger.name];
    const triggerInstance = new Trigger(triggerOptions);

    const triggerResult = await triggerInstance.run();
    const { shouldDeduplicate, getItemKey, every } = triggerInstance;
    let { items } = triggerResult;
    const maxItemsCount = trigger.options.max_items_count as number;
    const skipFirst = trigger.options.skip_first || false;

    if (!items || items.length === 0) {
      return finalResult;
    }
    // updateInterval
    const lastUpdatedAt =
      (await triggerHelpers.cache.get("lastUpdatedAt")) || 0;
    log.debug("lastUpdatedAt: ", lastUpdatedAt);

    if (every) {
      // check if should update
      // unit minutes
      // get latest update time
      const shouldUpdateUtil = (lastUpdatedAt as number) + every * 60 * 1000;
      const now = Date.now();
      const shouldUpdate = shouldUpdateUtil - now <= 0;
      log.debug("shouldUpdate:", shouldUpdate);
      // write to cache
      await triggerHelpers.cache.set("lastUpdatedAt", now);
      if (!shouldUpdate) {
        return finalResult;
      }
    }
    // duplicate
    if (shouldDeduplicate === true) {
      // duplicate
      const getItemKeyFn =
        getItemKey ||
        ((item: AnyObject): string => {
          if (item.guid) return item.guid as string;
          if (item.id) return item.id as string;
          return createContentDigest(item);
        });

      // deduplicate
      // get cache
      let deduplicationKeys =
        (await triggerHelpers.cache.get("deduplicationKeys")) || [];
      log.debug("get cached deduplicationKeys", deduplicationKeys);
      const itemsKeyMaps = new Map();
      items.forEach((item) => {
        itemsKeyMaps.set(getItemKeyFn(item), item);
      });
      items = [...itemsKeyMaps.values()];

      items = items.filter((result) => {
        const key = getItemKeyFn(result);
        if ((deduplicationKeys as string[]).includes(key)) {
          return false;
        } else {
          return true;
        }
      });

      if (maxItemsCount) {
        items = items.slice(0, maxItemsCount);
      }
      // if save to cache
      if (items.length > 0) {
        deduplicationKeys = (deduplicationKeys as string[]).concat(
          items.map((item: AnyObject) => getItemKeyFn(item))
        );
        deduplicationKeys = (deduplicationKeys as string[]).slice(
          -MAX_CACHE_KEYS_COUNT
        );
        log.debug("set deduplicationKeys", deduplicationKeys);

        // set cache
        await triggerHelpers.cache.set("deduplicationKeys", deduplicationKeys);
      } else {
        log.debug("no items update, do not need to update cache");
      }
    }

    if (skipFirst && lastUpdatedAt === 0) {
      return finalResult;
    }
    finalResult.items = items;
  } else {
    log.warn(`we don't support this trigger [${trigger.name}] yet`);
  }
  return finalResult;
};
