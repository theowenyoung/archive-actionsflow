import {
  ITriggerClassType,
  ITriggerContructorParams,
  AnyObject,
  ITriggerRunFunctionResult,
  ITriggerContext,
} from "actionsflow-interface";

export default class Webhook implements ITriggerClassType {
  context: ITriggerContext;
  constructor({ context }: ITriggerContructorParams) {
    this.context = context;
  }
  async run(): Promise<ITriggerRunFunctionResult> {
    const context = this.context;
    let items: AnyObject[] = [];
    if (
      context &&
      context.github &&
      context.github.event_name === "repository_dispatch"
    ) {
      const githubObj = context.github;
      const item = {
        payload: githubObj.event.client_payload,
        event: githubObj.event.action,
        body: {
          event_type: githubObj.event.action,
          client_payload: githubObj.event.client_payload,
        },
      };
      items = [item];
    }
    return {
      items: items,
    };
  }
}
