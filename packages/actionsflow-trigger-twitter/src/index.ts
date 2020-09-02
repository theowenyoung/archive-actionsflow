import {
  ITriggerClassType,
  ITriggerContructorParams,
  ITriggerRunFunctionResult,
  IHelpers,
  AnyObject,
} from "actionsflow-interface";
import Twit from "twit";
export default class Example implements ITriggerClassType {
  options: AnyObject = {};
  helpers: IHelpers;
  every = 5;
  shouldDeduplicate = true;
  getItemKey(item: AnyObject): string {
    if (item.id_str) return item.id_str as string;
    return this.helpers.createContentDigest(item);
  }
  constructor({ helpers, options }: ITriggerContructorParams) {
    this.options = options;
    this.options.auth = this.options.auth || {};
    this.options.params = (this.options.params as AnyObject) || {};
    this.helpers = helpers;

    if (options.every) {
      this.every = options.every as number;
    }
  }

  async run(): Promise<ITriggerRunFunctionResult> {
    const {
      consumer_key,
      consumer_secret,
      access_token,
      access_token_secret,
    } = this.options.auth as {
      consumer_key: string;
      consumer_secret: string;
      access_token: string;
      access_token_secret: string;
    };
    const { event } = this.options as {
      event: string;
    };
    const finalResult: ITriggerRunFunctionResult = {
      items: [],
    };
    const twitter = new Twit({
      consumer_key,
      consumer_secret,
      access_token,
      access_token_secret,
    });
    if (event === "new_my_tweets") {
      // get screen_name
      const optionParams = this.options.params as AnyObject;
      const params = {
        screen_name: "",
        count: 200,
        exclude_replies: true,
        include_rts: true,
        tweet_mode: "extended",
        ...optionParams,
      };
      const result = await twitter.get("statuses/user_timeline", params);
      finalResult.items = result.data as AnyObject[];
    }

    return finalResult;
  }
}
