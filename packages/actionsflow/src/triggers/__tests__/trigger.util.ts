import { ITriggerContructorParams, AnyObject } from "actionsflow-interface";
import { getCache, createContentDigest } from "../../helpers";
export const CONTEXT = {
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
};
export const getTriggerConstructorParams = ({
  options,
  name,
}: {
  options: AnyObject;
  name: string;
}): ITriggerContructorParams => {
  return {
    options: options,
    helpers: {
      cache: getCache(name + "trigger-test-cache"),
      createContentDigest,
    },
    context: CONTEXT,
  };
};
