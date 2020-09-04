import {
  IWebhookHandler,
  IWebhook,
  IWebhookRequest,
  IWorkflow,
  ITrigger,
  AnyObject,
  IWebhookRequestPayload,
} from "actionsflow-interface";
import { match, Match } from "path-to-regexp";

import { getTriggerWebhookBasePath } from "./utils";
import log from "loglevel";
export const getWebhook = ({
  webhooks,
  request,
  workflow,
  trigger,
}: {
  webhooks: IWebhook[];
  request: IWebhookRequestPayload;
  workflow: IWorkflow;
  trigger: ITrigger;
}): { request: IWebhookRequest; handler: IWebhookHandler } | undefined => {
  const requestPath = request.path;
  const requestMethod = request.method;
  const webhookBasePath = getTriggerWebhookBasePath(
    workflow.relativePath,
    trigger.name
  );
  if (requestPath.startsWith(webhookBasePath)) {
    let requestPathWithoutWebhookBasePath = requestPath.slice(
      webhookBasePath.length
    );
    if (!requestPathWithoutWebhookBasePath.startsWith("/")) {
      requestPathWithoutWebhookBasePath = `/${requestPathWithoutWebhookBasePath}`;
    }
    let matchedWebhook:
      | { request: IWebhookRequest; handler: IWebhookHandler }
      | undefined;
    // lookup webhook handler
    webhooks.forEach((webhook) => {
      let isMethodMatched = false;
      if (webhook.method) {
        isMethodMatched = webhook.method.toLowerCase() === requestMethod;
      } else {
        // not define method
        isMethodMatched = true;
      }
      let isMatchedPath = false;
      // eslint-disable-next-line @typescript-eslint/ban-types
      let matchResult: Match<object> | undefined;
      if (webhook.path) {
        // regex path
        const matchFn = match(webhook.path, { decode: decodeURIComponent });
        matchResult = matchFn(requestPathWithoutWebhookBasePath);
        if (matchResult) {
          isMatchedPath = true;
        }
      } else {
        isMatchedPath = true;
      }
      if (isMethodMatched && isMatchedPath) {
        request.path = requestPathWithoutWebhookBasePath;
        matchedWebhook = {
          handler: webhook.handler,
          request: {
            ...(request as IWebhookRequest),
            params: matchResult ? (matchResult.params as AnyObject) : {},
          },
        };
      }
    });
    if (matchedWebhook) {
      return matchedWebhook;
    } else {
      log.debug(
        `not found any webhooks matched for request path ${requestPath}`
      );
      return;
    }
  } else {
    log.warn(
      `can not found matched webhook handler for request path ${requestPath}`
    );
    return;
  }
};
