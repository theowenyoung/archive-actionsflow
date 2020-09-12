---
title: "Webhook"
metaTitle: "Actionsflow Webhook Trigger"
metaDescription: "Trigger by a Webhook request"
---

You can use webhook trigger to receive data from any service.

[View trigger on Github](https://github.com/actionsflow/actionsflow/blob/master/packages/actionsflow/src/triggers/webhook.ts)

# Usage

```yaml
on:
  webhook:
```

## Setup Webhook URL

The webhook URL is in the following format, you should set this URL to the 3rd party service webhook settings.

```bash
https://webhook.actionsflow.workers.dev/<owner>/<repo>/<workflow-file-name>/webhook?__token=<your-github-personal-token>
```

> `<workflow-file-name>` is your workflow file name without ext. For example, if you define a webhook trigger at `./workflows/webhook.yml`, then, `<workflow-file-name>` is `webhook`

> You need to generate personal access tokens with `repo` scope at [Github settings](https://github.com/settings/tokens), then replace `<your-github-personal-token>`

Here is an example for sending a webhook event:

```bash
curl --request POST 'https://webhook.actionsflow.workers.dev/actionsflow/actionsflow/webhook/webhook?__token=<your-github-personal-token>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "key": "value"
}'
```

Learn more about webhook URL, see [here](/docs/webhook.md)

### IFTTT Webhook Request example

You can send webhook event from [IFTTT webhook](https://ifttt.com/maker_webhooks).

For example, you can input the following value at [IFTTT webhook](https://ifttt.com/maker_webhooks) settings:

- URL: `https://webhook.actionsflow.workers.dev/actionsflow/actionsflow/webhook/webhook?__token=<your-github-personal-token>`
- Method: `POST`
- Content Type: `application/json`
- Body

```json
{
  "key": "value"
}
```

> Tips: if your field content need to be escaped, you should surround it with `<<<>>>`

## Params

This trigger accepts [all trigger's general params](/docs/workflow.md#ontrigger_nameparam).

- `method`, optional, `string` or `string[]`, you can define one or more as the specific method that the webhook should listen, the default is `undefined`, means that the webhook would listen all methods. The options value can be `get`, `post`, `put`, `patch`, `delete`, `head`, `options`
- `should_deduplicate`, optional, `boolean`, if the webhook payload should be dedeplicate, the default value is `false`, it means every webhook request will trigger the jobs. You can set this `true`, and set `deduplication_key` to define the deduplication key.
- `deduplication_key`, optional. The webhook trigger deduplicates the webhook body payload against body `id` key. If the id key does not exist, you should specify an alternative unique key to deduplicate. If neither are supplied, we fallback to looking for `id`, `key`, if neither are supplied, we will hash the body, and generate a unique key

## Outputs

An outputs example:

```json
{
  "headers": {
    "content-type": "application/json"
  },
  "method": "post",
  "query": {
    "test": "1"
  },
  "querystring": "test=1",
  "search": "?test=1",
  "body": {
    "id": "testid",
    "title": "title"
  }
}
```

You can use the outputs like this:

```yaml
on:
  webhook:
jobs:
  print:
    name: Print
    runs-on: ubuntu-latest
    steps:
      - name: Print Outputs
        env:
          method: ${{ on.webhook.outputs.method }}
          body: ${{ toJson(on.webhook.outputs.body) }}
          headers: ${{ toJson(on.webhook.outputs.headers) }}
        run: |
          echo method: $method
          echo headers $headers
          echo body: $body
```

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
