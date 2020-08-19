import {
  ITriggerClassType,
  ITriggerRunFunction,
  IItem,
  ITriggerRunFunctionResult,
  TriggerName,
} from "../interfaces";

export default class Webhook implements ITriggerClassType {
  id: TriggerName = "webhook";
  async run({
    context,
  }: ITriggerRunFunction): Promise<ITriggerRunFunctionResult> {
    // if need
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
