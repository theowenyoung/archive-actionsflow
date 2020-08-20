import { AnyObject } from "actionsflow-interface";

export default class Parser {
  parseURL(): { items: AnyObject[] } {
    return {
      items: [
        {
          title: "test",
          guid: "https://hnrss.org/newest?points=300",
        },
      ],
    };
  }
}
