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
    event: test
```

## Trigger Webhook

We implement Webhook feature by using Github's [`repository_dispatch`](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#repository_dispatch), So you need to make a `POST` request to `https://<github-user-name>:<github-personal-token>@api.github.com/repos/<github-user-name>/<github-repo-name>/dispatches`, with headers `Content-Type: application/json`, with JSON body:

```json
{
  "event_type": "test",
  "client_payload": {
    "value1": "xxx",
    "key": "value"
  }
}
```

<https://webhook.actionsflow.io/owner/repo/telegram/telegram_bot>

```json
{
  "event_type": "webhook",
  "client_payload": {
    "path": "/telegram/telegram_bot/webhook",
    "method": "POST",
    "headers": {},
    "body": {}
  }
}
```

You need to generate personal access tokens with `repo` scope at [Github settings](https://github.com/settings/tokens)

### Curl example

```bash
curl --location --request POST 'https://<github-user-name>:<github-personal-token>@api.github.com/repos/<github-user-name>/<github-repo-name>/dispatches' \
--header 'Content-Type: application/json' \
--data-raw '{
  "event_type": "test",
  "client_payload": {
    "value1": "xxx",
    "key": "value"
  }
}'
```

### Nodejs Axios example

```javascript
var axios = require("axios");
var data = JSON.stringify({
  event_type: "test",
  client_payload: { value1: "xxx", key: "value" },
});

var config = {
  method: "post",
  url:
    "https://<github-user-name>:<github-personal-token>@api.github.com/repos/<github-user-name>/<github-repo-name>/dispatches",
  headers: {
    "Content-Type": "application/json",
  },
  data: data,
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
```

### IFTTT Webhook Request example

> !!Note, for some reason, IFTTT can not post Github API directly, always response 403 status code, I don't know the reason yet, I suspect it's a Github API problem, but I'm not sure. if you know why, please let me know!

I create a webhook relay API for forwarding IFTTT's request to Github service temporarily. So you can use it like this:

You can use IFTTT webhook as a `then` action to trigger the webhook, here is an example:

- URL: `https://<github-user-name>:<github-personal-token>@eno9s1l2xztg49j.m.pipedream.net/https://api.github.com/repos/<github-user-name>/<github-repo-name>/dispatches`
- Method: `POST`
- Content Type: `application/json`
- Body

```json
{
  "event_type": "test",
  "client_payload": {
    "value1": "<<<{{Text}}>>>",
    "key": "<<<{{AuthorName}}>>>"
  }
}
```

> Tips: if your field content need to be escaped, you should surround it with `<<<>>>`

## Params

This trigger accepts [all trigger's general params](https://actionsflow.github.io/docs/triggers/#general-params-for-triggers).

- `event`, optional, it will be trigger when post body `event_type` === `event`,if not provided, all events will trigger this workflow

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
