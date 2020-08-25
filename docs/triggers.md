---
title: "Triggers"
metaTitle: "Actionsflow Triggers"
---

Every Actionsflow workflow file starts with a trigger, which watches for new data as it comes in or a polling API call to check for new data periodically.

Triggers are how your workflows can start automated workflows whenever they add or update something in your workflow. Actionsflow extend the triggers that [Github actions](https://docs.github.com/en/actions/reference/events-that-trigger-workflows) supported, For now, Actionsflow supports:

- [New RSS item](/docs/triggers/rss.md)
- [API polling](/docs/triggers/poll.md)
- [Webhook](/docs/triggers/webhook.md)
- [Telegram Bot](/docs/triggers/telegram-bot.md)

An Actionsflow workflow can include multiple triggers, you can use the trigger's outputs at the [jobs](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobs)
