---
title: "Triggers"
metaTitle: "Actionsflow Triggers"
---

Every Actionsflow workflow file starts with a trigger, which watches for new data as it comes in or a polling API call to check for new data periodically.

Triggers are how your workflows can start automated workflows whenever they add or update something in your workflow. Actionsflow extends the triggers that [Github actions](https://docs.github.com/en/actions/reference/events-that-trigger-workflows) supported.

# Triggers supported

For now, Actionsflow supports:

- [RSS](/docs/triggers/0-rss.md)
- [API polling](/docs/triggers/1-poll.md)
- [Webhook](/docs/triggers/2-webhook.md)

An Actionsflow workflow can include multiple triggers, you can use the trigger's outputs at the [job steps](/docs/steps.md)

# General params for triggers

All triggers support the following params:

- `active`, optional, `boolean`, if the trigger is active, default is `true`. for some reason, you can make trigger inactive by set `active: false`
- `every`, optional, `number`, polling data interval time, the unit is minute, the default value is `5`
- `skip_first`, optional, `boolean`, whether to skip the data obtained for the first time, if `true`, the trigger will run the next time it get data. The default value is `false`
- `max_items_count`, optional, the trigger's results max length, the default value is `undefined`, it means the trigger will trigger all items
- `should_deduplicate`, optional, `boolean`, if the trigger's results should be dedeplicate, the default value is decided by the trigger, you can force to override it.
- `force`, optional, `boolean`, whether to force data to be updated, if `true`, the trigger will ignore cache, and last update time. The default value is `false`
- `log_level`, optional, `string`, log level for trigger, the default value is `info`, you can use `trace`, `debug`, `info`, `warn`, `error`

# Context and expression syntax for Actionsflow triggers

You can access context information in workflow triggers, you need to use specific syntax to tell Actionsflow to evaluate a variable rather than treat it as a string.

```yaml
${{ <context> }}
```

For now, you can use [`secrets`](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets), and [`github`](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context) as trigger's context, the two objects are set by Github actions, you can use them in trigger config. For example:

```yaml
on:
  telegram_bot:
    token: ${{ secrets.TELEGRAM_BOT_TOKEN }}
```
