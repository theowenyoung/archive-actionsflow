import resolveCwd from "resolve-cwd";
import { ITriggerClassTypeConstructable } from "actionsflow-interface";
import { log } from "../log";

export const getThirdPartyTrigger = (
  triggerName: string
): ITriggerClassTypeConstructable | undefined => {
  // first resolve local triggers
  log.debug(`Try to find trigger: [${triggerName}]`);
  log.debug(`Try to find trigger at ./triggers/${triggerName}`);

  // support package name
  const thirdPartyTrigger = `${triggerName}`;
  log.debug("Try to find trigger at package: ", thirdPartyTrigger);
  let triggerPath = resolveCwd.silent(thirdPartyTrigger);

  // TODO get @scope/actionsflow-trigger-xxxx

  if (!triggerPath) {
    const thirdPartyTrigger = `actionsflow-trigger-${triggerName}`;
    log.debug("Try to find trigger at package: ", thirdPartyTrigger);
    triggerPath = resolveCwd.silent(thirdPartyTrigger);
  }
  if (!triggerPath) {
    const thirdPartyTrigger = `@actionsflow/trigger-${triggerName}`;
    log.debug("Try to find trigger at package: ", thirdPartyTrigger);
    triggerPath = resolveCwd.silent(thirdPartyTrigger);
  }

  if (triggerPath) {
    log.debug("Found third party trigger at: ", triggerPath);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Trigger = require(triggerPath);
    if (Trigger.default) {
      return Trigger.default;
    } else {
      return Trigger;
    }
  } else {
    return undefined;
  }
};

export const getLocalTrigger = (
  triggerName: string
): ITriggerClassTypeConstructable | undefined => {
  // first resolve local triggers
  log.debug(`Try to find trigger: [${triggerName}]`);
  log.debug(`Try to find trigger at ./triggers/${triggerName}`);
  const triggerPath = resolveCwd.silent(`./triggers/${triggerName}`);
  if (triggerPath) {
    log.debug("Found third party trigger at: ", triggerPath);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Trigger = require(triggerPath);
    if (Trigger.default) {
      return Trigger.default;
    } else {
      return Trigger;
    }
  } else {
    return undefined;
  }
};
