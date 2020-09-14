import {
  ITriggerClassType,
  ITriggerContructorParams,
  AnyObject,
  ITriggerOptions,
  IHelpers,
  IWebhookRequest,
} from "actionsflow-interface";

export default class Slack implements ITriggerClassType {
  constructor({ helpers, options }: ITriggerContructorParams) {
    this.options = options;
    this.helpers = helpers;
  }
  options: ITriggerOptions = {};
  helpers: IHelpers;
  shouldDeduplicate = false;
  webhooks = [
    {
      method: "post",
      handler: (request: IWebhookRequest): AnyObject[] => {
        let items: AnyObject[] = [];
        if (request.body) {
          items = [request.body as AnyObject];
        }
        return items;
      },
    },
  ];
}
