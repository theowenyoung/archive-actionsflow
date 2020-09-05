import { ITriggerContructorParams, AnyObject } from "actionsflow-interface";
import { getTriggerHelpers } from "../../trigger";
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
    helpers: getTriggerHelpers({
      name: name,
      workflowRelativePath: "test.yml",
    }),
    context: CONTEXT,
  };
};
