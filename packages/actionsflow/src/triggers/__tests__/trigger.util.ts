import { ITriggerContructorParams, AnyObject } from "actionsflow-interface";
import { getTriggerOptions } from "../../trigger";
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
  return getTriggerOptions({
    trigger: {
      name,
      options,
      workflowRelativePath: "test.yml",
    },
    context: CONTEXT,
  });
};
