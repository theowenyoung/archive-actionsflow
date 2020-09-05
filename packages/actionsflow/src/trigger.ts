import { getThirdPartyTrigger } from "./utils";
import { createContentDigest, getCache } from "./helpers";
import log from "./log";
import Triggers from "./triggers";
import {
  ITriggerContext,
  ITriggerInternalResult,
  AnyObject,
  ITriggerClassTypeConstructable,
  ITriggerResult,
  IWorkflow,
  ITriggerEvent,
  ITriggerClassType,
  IHelpers,
  IWebhookRequestPayload,
} from "actionsflow-interface";
import { getWebhook } from "./webhook";
const MAX_CACHE_KEYS_COUNT = 5000;
interface ITriggerOptions {
  trigger: {
    name: string;
    options: Record<string, unknown>;
  };
  workflow: IWorkflow;
  event: ITriggerEvent;
  context: ITriggerContext;
}
export const getTriggerId = ({
  name,
  workflowRelativePath,
}: {
  name: string;
  workflowRelativePath: string;
}): string => {
  const triggerId = createContentDigest({
    name: name,
    path: workflowRelativePath,
  });
  return triggerId;
};
export const getTriggerHelpers = ({
  name,
  workflowRelativePath,
}: {
  name: string;
  workflowRelativePath: string;
}): IHelpers => {
  const triggerId = getTriggerId({
    name: name,
    workflowRelativePath: workflowRelativePath,
  });
  const triggerHelpers = {
    createContentDigest,
    cache: getCache(`trigger-${triggerId}`),
  };
  return triggerHelpers;
};
const allTriggers = Triggers as Record<string, ITriggerClassTypeConstructable>;
interface IGeneralTriggerOptions {
  every: number;
  shouldDeduplicate: boolean;
  getItemKey?: (item: AnyObject) => string;
  skipFirst: boolean;
  maxItemsCount: number;
  force: boolean;
}
export const getGeneralTriggerFinalOptions = (
  triggerInstance: ITriggerClassType,
  userOptions: AnyObject
): IGeneralTriggerOptions => {
  const options: IGeneralTriggerOptions = {
    every: 5,
    shouldDeduplicate: true,
    getItemKey: (item: AnyObject): string => {
      return createContentDigest(item);
    },
    skipFirst: false,
    maxItemsCount: -1,
    force: false,
  };
  if (!userOptions.every === undefined) {
    options.every = Number(userOptions.every);
  }
  if (triggerInstance.shouldDeduplicate !== undefined) {
    options.shouldDeduplicate = Boolean(triggerInstance.shouldDeduplicate);
  }

  if (options.shouldDeduplicate) {
    if (triggerInstance.getItemKey) {
      options.getItemKey = triggerInstance.getItemKey.bind(triggerInstance);
    }
  }
  if (userOptions.skip_first !== undefined) {
    options.skipFirst = Boolean(userOptions.skip_first);
  }
  if (userOptions.max_items_count) {
    options.maxItemsCount = Number(userOptions.max_items_count);
  }
  if (userOptions.force !== undefined) {
    options.force = Boolean(userOptions.force);
  }

  return options;
};
export const run = async ({
  trigger,
  context,
  event,
  workflow,
}: ITriggerOptions): Promise<ITriggerInternalResult> => {
  log.debug("trigger:", trigger);
  log.debug("trigger event", event);
  const finalResult: ITriggerInternalResult = {
    items: [],
    outcome: "success",
    conclusion: "success",
  };

  let Trigger: ITriggerClassTypeConstructable | undefined;

  if (allTriggers[trigger.name]) {
    Trigger = allTriggers[trigger.name];
  }

  if (!Trigger) {
    Trigger = getThirdPartyTrigger(
      trigger.name
    ) as ITriggerClassTypeConstructable;
  }

  if (Trigger) {
    const triggerHelpers = getTriggerHelpers({
      name: trigger.name,
      workflowRelativePath: workflow.relativePath,
    });
    finalResult.helpers = triggerHelpers;
    const triggerInstance = new Trigger({
      helpers: triggerHelpers,
      options: trigger.options || {},
      context: context,
    });

    let triggerResult: ITriggerResult | undefined;
    const triggerId = getTriggerId({
      name: trigger.name,
      workflowRelativePath: workflow.relativePath,
    });
    const triggerCacheManager = getCache(`trigger-cache-manager-${triggerId}`);

    if (triggerInstance) {
      const triggerGeneralOptions = getGeneralTriggerFinalOptions(
        triggerInstance,
        trigger.options
      );
      const {
        every,
        shouldDeduplicate,
        maxItemsCount,
        skipFirst,
        force,
      } = triggerGeneralOptions;
      const lastUpdatedAt =
        (await triggerCacheManager.get("lastUpdatedAt")) || 0;
      log.debug("lastUpdatedAt: ", lastUpdatedAt);
      if (event.type === "webhook" && triggerInstance.webhooks) {
        // webhook event should call webhook method
        // lookup specific webhook event
        // call webhooks
        const webhook = getWebhook({
          webhooks: triggerInstance.webhooks,
          request: event.request as IWebhookRequestPayload,
          workflow,
          trigger,
        });

        if (webhook) {
          // check if specific getItemKey at Webhook
          if (webhook.getItemKey) {
            triggerGeneralOptions.getItemKey = webhook.getItemKey.bind(
              triggerInstance
            );
          }
          triggerResult = await webhook.handler.bind(triggerInstance)(
            webhook.request
          );
          await triggerCacheManager.set("lastUpdatedAt", Date.now());
        } else {
          // skip
          log.info(
            `No webhook path matched request path, skip [${trigger.name}] trigger building`
          );
        }
      } else if (triggerInstance.run) {
        // updateInterval

        // check if should update
        // unit minutes
        // get latest update time
        const shouldUpdateUtil = (lastUpdatedAt as number) + every * 60 * 1000;
        const now = Date.now();

        const shouldUpdate = force || shouldUpdateUtil - now <= 0;
        log.debug("shouldUpdate:", shouldUpdate);
        // write to cache
        if (!shouldUpdate) {
          finalResult.outcome = "skipped";
          finalResult.conclusion = "skipped";
          triggerResult = { items: [] };
        } else {
          // check should run
          // scheduled event call run method
          triggerResult = await triggerInstance.run();
          await triggerCacheManager.set("lastUpdatedAt", Date.now());
        }
      } else {
        //  skipped, no method for the event type
        finalResult.outcome = "skipped";
        finalResult.conclusion = "skipped";
        triggerResult = { items: [] };
      }

      if (triggerResult && triggerResult.items) {
        const { getItemKey } = triggerGeneralOptions;
        let { items } = triggerResult;
        if (items.length > 0) {
          // duplicate
          if (shouldDeduplicate === true && getItemKey && !force) {
            // deduplicate
            // get cache
            let deduplicationKeys =
              (await triggerCacheManager.get("deduplicationKeys")) || [];
            log.debug("get cached deduplicationKeys", deduplicationKeys);
            const itemsKeyMaps = new Map();
            items.forEach((item) => {
              itemsKeyMaps.set(getItemKey(item), item);
            });
            items = [...itemsKeyMaps.values()];
            items = items.filter((result) => {
              const key = getItemKey(result);
              if ((deduplicationKeys as string[]).includes(key)) {
                return false;
              } else {
                return true;
              }
            });

            // if save to cache
            if (items.length > 0) {
              deduplicationKeys = (deduplicationKeys as string[]).concat(
                items.map((item: AnyObject) => getItemKey(item))
              );
              deduplicationKeys = (deduplicationKeys as string[]).slice(
                -MAX_CACHE_KEYS_COUNT
              );

              // set cache
              await triggerCacheManager.set(
                "deduplicationKeys",
                deduplicationKeys
              );
              log.debug("save deduplicationKeys to cache", deduplicationKeys);
            } else {
              log.debug("no items update, do not need to update cache");
            }
          }
          if (maxItemsCount > 0) {
            items = items.slice(0, maxItemsCount);
          }
        }

        if (!(skipFirst && lastUpdatedAt === 0) || force) {
          finalResult.items = items;
        }

        return finalResult;
      } else {
        throw new Error(
          `Trigger [${trigger.name}] does not return a valid result with items key`
        );
      }
    } else {
      throw new Error(`Trigger [${trigger.name}] construct error`);
    }
  }
  return finalResult;
};
