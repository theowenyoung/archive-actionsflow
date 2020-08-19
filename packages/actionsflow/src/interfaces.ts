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
export interface IHelpers {
  createContentDigest: (input: unknown) => string;
  cache: {
    get: (key: string) => Promise<unknown>;
    set: (key: string, value: unknown) => Promise<unknown>;
  };
}
export interface ITriggerContructorParams {
  options: AnyObject;
  helpers: IHelpers;
  context: ITriggerContext;
}
export interface IItem {
  [key: string]: unknown;
}
export interface ITriggerRunFunctionResult {
  items: IItem[];
}
export type TriggerName = "rss" | "telegram_bot" | "webhook" | "poll";

export interface ITriggerClassType {
  name: TriggerName;
  every?: number;
  shouldDeduplicate?: boolean;
  getItemKey?: (item: IItem) => string;
  run(): Promise<ITriggerRunFunctionResult>;
}
export interface ITriggerClassTypeConstructable {
  new (params: ITriggerContructorParams): ITriggerClassType;
}
export interface ITrigger {
  id?: string;
  name: TriggerName;
  options: AnyObject;
  payload?: AnyObject;
}

export interface IWorkflow {
  path: string;
  relativePath: string;
  data: AnyObject;
  triggers: ITrigger[];
}
export interface ITriggerResult {
  id: string;
  items: IItem[];
}
