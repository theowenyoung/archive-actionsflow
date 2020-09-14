import {
  getCache,
  getTriggerId,
  getTriggerHelpers,
  getGeneralTriggerFinalOptions,
  getThirdPartyTrigger,
  isPromise,
  log,
  getWebhookByRequest,
} from "actionsflow-core";
import { LogLevelDesc } from "loglevel";
import Triggers from "./triggers";
import {
  ITriggerInternalResult,
  AnyObject,
  ITriggerClassTypeConstructable,
  ITriggerResult,
  IWorkflow,
  ITriggerEvent,
  IWebhookRequestPayload,
  ITrigger,
} from "actionsflow-interface";
const MAX_CACHE_KEYS_COUNT = 5000;
interface ITriggerInternalOptions {
  trigger: {
    name: string;
    options: AnyObject;
  };
  workflow: IWorkflow;
  event: ITriggerEvent;
}
interface ITriggerHelpersOptions {
  name: string;
  workflowRelativePath: string;
  logLevel?: LogLevelDesc;
}

const allTriggers = Triggers as Record<string, ITriggerClassTypeConstructable>;

export const run = async ({
  trigger,
  event,
  workflow,
}: ITriggerInternalOptions): Promise<ITriggerInternalResult> => {
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
    const triggerHelperOptions: ITriggerHelpersOptions = {
      name: trigger.name,
      workflowRelativePath: workflow.relativePath,
    };
    if (trigger.options && trigger.options.log_level) {
      triggerHelperOptions.logLevel = trigger.options.log_level as LogLevelDesc;
    }
    const triggerHelpers = getTriggerHelpers(triggerHelperOptions);
    finalResult.helpers = triggerHelpers;
    const triggerInstance = new Trigger({
      helpers: triggerHelpers,
      options: trigger.options || {},
      workflow: workflow,
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
        const webhook = getWebhookByRequest({
          webhooks: triggerInstance.webhooks,
          request: event.request as IWebhookRequestPayload,
          workflow,
          trigger,
        });

        if (webhook) {
          log.debug("detect webhook2", webhook);
          // check if specific getItemKey at Webhook
          if (webhook.getItemKey) {
            triggerGeneralOptions.getItemKey = webhook.getItemKey.bind(
              triggerInstance
            );
          }
          const webhookHandlerResult = webhook.handler.bind(triggerInstance)(
            webhook.request
          );
          if (isPromise(webhookHandlerResult)) {
            triggerResult = (await webhookHandlerResult) as ITriggerResult;
          } else {
            triggerResult = webhookHandlerResult as ITriggerResult;
          }
          await triggerCacheManager.set("lastUpdatedAt", Date.now());
        } else {
          // skip
          throw new Error(
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
          const runHandler = triggerInstance.run.bind(triggerInstance)();
          if (isPromise(runHandler)) {
            triggerResult = (await runHandler) as ITriggerResult;
          } else {
            triggerResult = runHandler as ITriggerResult;
          }
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
        log.debug("no items update, do not need to update cache");
      }
    } else {
      throw new Error(`Trigger [${trigger.name}] construct error`);
    }
  }
  return finalResult;
};

export const getSupportedTriggers = (rawTriggers: ITrigger[]): ITrigger[] => {
  const supportTriggerKeys = Object.keys(Triggers);
  const triggers = [];

  for (let index = 0; index < rawTriggers.length; index++) {
    const trigger = rawTriggers[index];
    const name = trigger.name;
    const options = trigger.options || {};
    // check thirdparty support
    let isTriggerSupported = false;
    if (supportTriggerKeys.includes(name)) {
      isTriggerSupported = true;
    } else if (getThirdPartyTrigger(name)) {
      isTriggerSupported = true;
    }
    if (!isTriggerSupported) {
      log.info(
        `can not found the trigger [${name}]. Did you forget to install the third party trigger?
Try \`npm i @actionsflow/trigger-${name}\` if it exists.
`
      );
    }
    if (isTriggerSupported) {
      // is active
      if (!(options.active === false)) {
        // valid event
        triggers.push(trigger);
      }
    }
  }
  return triggers;
};
