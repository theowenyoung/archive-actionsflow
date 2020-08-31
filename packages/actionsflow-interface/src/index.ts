export type AnyObject = Record<string, unknown>;
export interface IGithub {
  event: AnyObject;
  [key: string]: unknown;
}
export interface IHelpers {
  createContentDigest: (input: unknown) => string;
  cache: {
    get: (key: string) => Promise<unknown>;
    set: (key: string, value: unknown) => Promise<unknown>;
    del: (key: string) => Promise<void>;
    reset: () => Promise<void>;
  };
}
export interface ITriggerContext extends AnyObject {
  secrets: Record<string, string>;
  github: IGithub;
}

export interface ITriggerContructorParams {
  options: AnyObject;
  helpers: IHelpers;
  context: ITriggerContext;
}

export interface ITriggerRunFunctionResult {
  items: AnyObject[];
}

export interface ITriggerClassType {
  every?: number;
  shouldDeduplicate?: boolean;
  getItemKey?: (item: AnyObject) => string;
  run(): Promise<ITriggerRunFunctionResult>;
}
export interface ITriggerClassTypeConstructable {
  new (params: ITriggerContructorParams): ITriggerClassType;
}
export interface ITrigger {
  name: string;
  options: AnyObject;
  payload?: AnyObject;
}
export interface ITriggerResult {
  items: AnyObject[];
  helpers?: IHelpers;
}
export interface IWorkflow {
  path: string;
  relativePath: string;
  data: AnyObject;
  rawTriggers: ITrigger[];
}
