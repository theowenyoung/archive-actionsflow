import resolveCwd from "resolve-cwd";
import { ITriggerClassTypeConstructable } from "actionsflow-interface";
import log from "../log";

export const getThirdPartyTrigger = (
  triggerName: string
): ITriggerClassTypeConstructable | undefined => {
  const thirdPartyTrigger = `@actionsflow/trigger-${triggerName}`;
  log.debug("third party trigger", thirdPartyTrigger);
  let triggerPath = resolveCwd.silent(thirdPartyTrigger);
  if (!triggerPath) {
    triggerPath = resolveCwd.silent(`actionsflow-trigger-${triggerName}`);
  }
  log.debug("third party trigger path", triggerPath);
  if (triggerPath) {
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
