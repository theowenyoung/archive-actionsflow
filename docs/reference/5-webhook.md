---
title: Webhook Introduction
---

Some triggers (like [telegram_bot](https://github.com/actionsflow/actionsflow/tree/master/packages/actionsflow-trigger-telegram_bot)) may provide webhook option, so you can get updates more timely.

Actionsflow provide a general webhook capability for triggers, if the trigger support webhook, you can set a webhook URL at the third party platform, then the trigger will handle your webhook event.

Generally, a webhook URL will look like this:

```bash
https://webhook.actionsflow.workers.dev/<owner>/<repo>/<workflow-file-name>/<trigger-name>?__token=<your-github-personal-token>
```

You need to generate personal access tokens with `repo` scope at [Github settings](https://github.com/settings/tokens), then replace `<your-github-personal-token>`.

The default response of the webhook will use [the github `create-a-repository-dispatch-event` API response](https://docs.github.com/en/rest/reference/repos#create-a-repository-dispatch-event). You can use search params `__response_code`, `__response_content_type`, `__response_body` to specify a custom response.

You can also use headers `X-Github-Authorization` instead of search params `__token` for more security.

The webhook also supports the cross-origin resource sharing request.

Specify response code:

```bash
curl --request POST 'https://webhook.actionsflow.workers.dev/actionsflow/webhook2github/webhook/webhook?__token=<your-github-personal-token>&__response_code=200' \
--header 'Content-Type: application/json' \
--data-raw '{
    "key": "value"
}'
```

> `https://webhook.actionsflow.workers.dev/<owner>/<repo>/<workflow-file-name>/<trigger-name>` is the fixed prefix for webhook URL, most triggers will use this as their webhook URL. But if some trigger has more than one webhook path, the webhook URL may have a suffix, like `https://webhook.actionsflow.workers.dev/<owner>/<repo>/<workflow-file-name>/<trigger-name>/webhook1`, you should check that trigger's documentation about webhook URL to get more information.

# How It Works

We implement Webhook feature by using Github's [`repository_dispatch`](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#repository_dispatch), So we made the [webhook2github project](https://github.com/actionsflow/webhook2github)

This API will forward the following original webhook request:

```bash
https://webhook.actionsflow.workers.dev/<owner>/<repo>/<your-path>?__token=<your-github-personal-token>
```

To `https://api.github.com/repos/<owner>/<repo>/dispatches`, with body:

```json
{
  "event_type": "webhook",
  "client_payload": {
    "path": "<your-path>",
    "method": "<request.method>",
    "headers": "<request.headers>",
    "body": "<request body>"
  }
}
```

So Github actions will be triggered with `repository_dispatch` event.
