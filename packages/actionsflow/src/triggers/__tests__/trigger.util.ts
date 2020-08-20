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
        event_name: "repository_dispatch",
        event: {
          action: "test",
          client_payload: {
            test: 1,
          },
        },
      },
      secrets: {},
    },
    options: options,
  };
  return triggerParams;
};
