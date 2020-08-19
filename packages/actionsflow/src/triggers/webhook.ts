import {
  ITriggerClassType,
  ITriggerContructorParams,
  IItem,
  ITriggerRunFunctionResult,
  TriggerName,
  ITriggerContext,
} from "../interfaces";

export default class Webhook implements ITriggerClassType {
  name: TriggerName = "webhook";
  context: ITriggerContext;
  constructor({ context }: ITriggerContructorParams) {
    this.context = context;
  }
  async run(): Promise<ITriggerRunFunctionResult> {
    const context = this.context;
    let items: IItem[] = [];
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
