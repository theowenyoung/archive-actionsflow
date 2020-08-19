export interface IObject {
  [key: string]: unknown;
}
export type AnyObject = Record<string, unknown>;
export interface IGithub {
  event: AnyObject;
  [key: string]: unknown;
}

export interface ITriggerContext extends AnyObject {
  secrets: Record<string, string>;
  github: IGithub;
}
export interface ITriggerRunFunction {
  options: IObject;
  helpers: {
    createContentDigest: (input: unknown) => string;
    cache: {
      get: (key: string) => Promise<unknown>;
      set: (key: string, value: unknown) => Promise<unknown>;
    };
  };
  context: ITriggerContext;
}
export interface IItem {
  [key: string]: unknown;
}
export interface ITriggerRunFunctionResult {
  items: IItem[];
  shouldDeduplicate?: boolean;
  updateInterval?: number;
  getItemKey?: (item: IItem) => string;
}
export type TriggerName = "rss" | "telegram_bot" | "webhook" | "poll";

export interface ITriggerClassType {
  id: TriggerName;
  run(params: ITriggerRunFunction): Promise<ITriggerRunFunctionResult>;
}
export interface ITriggerClassTypeConstructable {
  new (): ITriggerClassType;
}
export interface ITrigger {
  id?: string;
  name: TriggerName;
  options: IObject;
  payload?: IObject;
}

export interface IWorkflow {
  path: string;
  relativePath: string;
  data: IObject;
  triggers: ITrigger[];
}
export interface ITriggerResult {
  id: string;
  items: IItem[];
}
