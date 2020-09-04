import {
  ITriggerEvent,
  ITriggerContext,
  IWebhookRequestRawPayload,
  HTTP_METHODS_LOWERCASE,
  IWebhookRequestPayload,
} from "actionsflow-interface";

export const getEventByContext = (context: ITriggerContext): ITriggerEvent => {
  const triggerEvent: ITriggerEvent = {
    type: "manual",
  };
  const githubObj = context.github;
  const isWebhookEvent =
    githubObj.event_name === "repository_dispatch" &&
    githubObj.event.action === "webhook";
  // is valid webhook event

  if (isWebhookEvent) {
    // valid client body
    const clientPayload =
      (githubObj.event.client_payload as IWebhookRequestRawPayload) || {};
    // get path
    triggerEvent.type = "webhook";
    if (!clientPayload.path) {
      clientPayload.path = "/";
    }
    if (!clientPayload.method) {
      if (clientPayload.body) {
        clientPayload.method = "post";
      } else {
        clientPayload.method = "get";
      }
    }
    if (!clientPayload.headers) {
      clientPayload.headers = {};
    }
    // format clientPayload

    clientPayload.method = clientPayload.method.toLowerCase() as HTTP_METHODS_LOWERCASE;
    if (!clientPayload.path.startsWith("/")) {
      clientPayload.path = `/${clientPayload.path}`;
    }
    // format body

    if (clientPayload.body && typeof clientPayload.body === "string") {
      try {
        clientPayload.body = JSON.parse(clientPayload.body);
      } catch (error) {
        // do nothing
      }
    }
    if (clientPayload.headers) {
      // lower case headers
      const newHeaders: Record<string, string> = {};
      const headersKeys = Object.keys(clientPayload.headers);
      headersKeys.forEach((key) => {
        newHeaders[key.toLowerCase()] = (clientPayload.headers as Record<
          string,
          string
        >)[key];
      });
      clientPayload.headers = newHeaders;
    }

    triggerEvent.request = clientPayload as IWebhookRequestPayload;
  } else if (githubObj.event_type === "schedule") {
    triggerEvent.type = "schedule";
  } else {
    // manual
    triggerEvent.type = "manual";
  }
  return triggerEvent;
};
