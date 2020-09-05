import {
  ITriggerContructorParams,
  AnyObject,
  IWorkflow,
} from "actionsflow-interface";
import path from "path";
import { getTriggerHelpers, getWorkflow } from "../../index";

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
export const getTriggerConstructorParams = async ({
  options,
  name,
}: {
  options: AnyObject;
  name: string;
}): Promise<ITriggerContructorParams> => {
  return {
    options: options,
    helpers: getTriggerHelpers({
      name: name,
      workflowRelativePath: "test.yml",
    }),
    context: CONTEXT,
    workflow: (await getWorkflow({
      path: path.resolve(__dirname, "./fixtures/workflows/rss.yml"),
      cwd: path.resolve(__dirname, "./fixtures"),
      context: CONTEXT,
    })) as IWorkflow,
  };
};
