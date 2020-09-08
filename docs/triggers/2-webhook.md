---
title: "Webhook"
metaTitle: "Actionsflow Webhook trigger"
metaDescription: "Trigger by a Webhook request"
---

# Events

## New Webhook Event

```yaml
on:
  webhook:
```

## Trigger Webhook

The webhook URL is in the following format:

```bash
https://webhook.actionsflow.workers.dev/<owner>/<repo>/<workflow-file-name>/webhook?__token=<your-github-personal-token>
```

> `<workflow-file-name>` is your workflow file name without ext. For example, if you define a webhook trigger at `./workflows/webhook.yml`, then, `<workflow-file-name>` is `webhook`

> You need to generate personal access tokens with `repo` scope at [Github settings](https://github.com/settings/tokens), then replace `<your-github-personal-token>`

For example,

```bash
curl --request POST 'https://webhook.actionsflow.workers.dev/actionsflow/actionsflow/webhook/webhook?__token=<your-github-personal-token>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "key": "value"
}'
```

### IFTTT Webhook Request example

You can use IFTTT webhook as a `then` action to trigger the workflow webhook, here is an example:

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

This trigger accepts [all trigger's general params](https://actionsflow.github.io/docs/triggers/#general-params-for-triggers).

- `method`, optional, `string` or `string[]`, you can define one or more as the specific method that the webhook should listen, the default is `undefined`, means that the webhook would listen all methods. The options value can be `get`, `post`, `put`, `patch`, `delete`, `head`, `options`
- `deduplication_key`, optional. The webhook trigger deduplicates the webhook body payload against body `id` key. If the id key does not exist, you should specify an alternative unique key to deduplicate. If neither are supplied, we fallback to looking for `id`, `key`, if neither are supplied, we will hash the body, and generate a unique key

## Outputs

An outputs example:

```json
{
  "event": "test",
  "payload": { "key1": "value1", "key2": "value2" },
  "body": {
    "event": "test"
  }
}
```

You can use the outputs like this:

```yaml
on:
  webhook:
    active: false
    event: test
jobs:
  print:
    name: Print
    runs-on: ubuntu-latest
    steps:
      - name: Print Outputs
        env:
          event: ${{ on.webhook.outputs.event }}
          payload: ${{ toJson(on.webhook.outputs.payload) }}
          body: ${{ toJson(on.webhook.outputs.body) }}
        run: |
          echo event: $event
          echo payload $payload
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
