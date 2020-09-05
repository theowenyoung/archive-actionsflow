import { URLSearchParams, URL } from "url";
import { ParsedUrlQuery } from "querystring";
import { Logger } from "loglevel";

export type HTTP_METHODS_LOWERCASE =
  | "head"
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "options";

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
  log: Logger;
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

export interface ITriggerResult {
  items: AnyObject[];
}
export interface IWebhookRequestRawPayload {
  method?: HTTP_METHODS_LOWERCASE;
  headers?: Record<string, string>;
  path?: string;
  body?: string | AnyObject | undefined;
}
export interface IWebhookRequestPayload {
  method: HTTP_METHODS_LOWERCASE;
  headers: Record<string, string>;
  originPath: string;
  path: string;
  query: ParsedUrlQuery;
  querystring: string;
  search: string;
  body?: string | AnyObject | undefined;
  searchParams: URLSearchParams;
  URL: URL;
}
export interface IWebhookRequest extends IWebhookRequestPayload {
  params: AnyObject;
}
export type IWebhookHandler = (
  request: IWebhookRequest
) => Promise<ITriggerResult> | ITriggerResult;
export interface IWebhook {
  path?: string;
  method?: string;
  getItemKey?: (item: AnyObject) => string;
  handler: IWebhookHandler;
}
export interface ITriggerClassType {
  shouldDeduplicate?: boolean;
  getItemKey?: (item: AnyObject) => string;
  run?(): Promise<ITriggerResult> | ITriggerResult;
  webhooks?: IWebhook[];
}
export interface ITriggerClassTypeConstructable {
  new (params: ITriggerContructorParams): ITriggerClassType;
}
export interface ITrigger {
  name: string;
  options: AnyObject;
}
export type OutcomeStatus = "success" | "failure" | "skipped";
export type ConclusionStatus = "success" | "failure" | "skipped";
export interface ITriggerBuildResult {
  outputs?: AnyObject;
  outcome: OutcomeStatus;
  conclusion: ConclusionStatus;
}
export interface ITriggerInternalResult {
  items: AnyObject[];
  outcome: OutcomeStatus;
  conclusion: ConclusionStatus;
  helpers?: IHelpers;
}
export interface IWorkflow {
  path: string;
  relativePath: string;
  filename: string;
  data: AnyObject;
  rawTriggers: ITrigger[];
}

export type TriggerEventType = "manual" | "schedule" | "webhook";
export interface ITriggerEvent {
  type: TriggerEventType;
  request?: IWebhookRequestPayload;
}

export interface ITask {
  workflow: IWorkflow;
  trigger: ITrigger;
  event: ITriggerEvent;
}
