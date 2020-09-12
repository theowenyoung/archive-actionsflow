import resolveCwd from "resolve-cwd";
import { ITriggerClassTypeConstructable } from "actionsflow-interface";
import { log } from "../log";

export const getThirdPartyTrigger = (
  triggerName: string
): ITriggerClassTypeConstructable | undefined => {
  // first resolve local triggers
  log.debug("try to load local trigger", triggerName);
  let triggerPath = resolveCwd.silent(`./triggers/${triggerName}`);

  if (!triggerPath) {
    const thirdPartyTrigger = `@actionsflow/trigger-${triggerName}`;
    log.debug("try to load third party trigger", thirdPartyTrigger);
    triggerPath = resolveCwd.silent(thirdPartyTrigger);
  }
  if (!triggerPath) {
    const thirdPartyTrigger = `actionsflow-trigger-${triggerName}`;
    log.debug("try to load third party trigger", thirdPartyTrigger);
    triggerPath = resolveCwd.silent(thirdPartyTrigger);
  }
  if (!triggerPath) {
    // support package name
    const thirdPartyTrigger = `${triggerName}`;
    log.debug("try to load third party trigger", thirdPartyTrigger);
    triggerPath = resolveCwd.silent(thirdPartyTrigger);
  }
  if (triggerPath) {
    log.debug("success found third party trigger: ", triggerPath);
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
