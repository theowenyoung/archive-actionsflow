import { ITriggerContructorParams, AnyObject } from "actionsflow-interface";
import { getCache, createContentDigest } from "../../helpers";
export const getTriggerConstructorParams = (
  options: AnyObject
): ITriggerContructorParams => {
  const triggerParams: ITriggerContructorParams = {
    helpers: {
      cache: getCache("test-trigger-cache"),
      createContentDigest,
    },
    context: {
      github: {
        event: {},
      },
      secrets: {},
    },
    options: options,
  };
  return triggerParams;
};
