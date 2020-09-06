import {
  ITriggerClassType,
  ITriggerContructorParams,
  IWebhook,
  AnyObject,
  ITriggerResult,
  IWebhookRequest,
  IHelpers,
} from "actionsflow-interface";

export default class Webhook implements ITriggerClassType {
  options: AnyObject = {};
  helpers: IHelpers;
  constructor({ options, helpers }: ITriggerContructorParams) {
    this.options = options;
    this.helpers = helpers;
    if (this.options.path) {
      this.webhooks[0].path = this.options.path as string;
    }
  }
  getItemKey(item: AnyObject): string {
    if (item.request_id) return item.request_id as string;
    return this.helpers.createContentDigest(item);
  }
  _getBodyKey(item: AnyObject): string {
    // TODO adapt every cases
    const deduplication_key = this.options.deduplication_key;
    if (deduplication_key) {
      return item[deduplication_key as string] as string;
    }
    if (item.id) return item.id as string;
    if (item.key) return item.key as string;
    return this.helpers.createContentDigest(item);
  }
  webhooks: IWebhook[] = [
    {
      handler: async (request: IWebhookRequest): Promise<ITriggerResult> => {
        const id = this._getBodyKey(request.body as AnyObject);
        return { items: [{ request_id: id, body: request.body }] };
      },
    },
  ];
}
