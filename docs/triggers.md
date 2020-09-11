---
title: "Triggers"
metaTitle: "Actionsflow Triggers"
---

Every Actionsflow workflow file starts with a trigger, which watches for new data as it comes in or makes a polling API call to check if there are new updates.

# Triggers List

For now, the following triggers are available:

> [Creating a 3rd-party trigger](/docs/creating-triggers.md) is really easy, we are so happy that you can share your trigger for community.

## Official Triggers

- [RSS](/docs/triggers/0-rss.md) - Watching RSS feed updates
- [API polling](/docs/triggers/1-poll.md) - Poling the rest JSON API updates
- [Webhook](/docs/triggers/2-webhook.md) - Receiving webhook notifications
- [Script](/docs/triggers/3-script.md) - Running javascript code to get updates
- [Telegram Bot](https://github.com/actionsflow/actionsflow/tree/master/packages/actionsflow-trigger-telegram_bot) - Watching Telegram Bot updates
- [Twitter](https://github.com/actionsflow/actionsflow/tree/master/packages/actionsflow-trigger-twitter) - Watching twitter's timeline updates

## Community Triggers

Want to list your trigger here? Welcome to [submit a pull request](https://github.com/actionsflow/actionsflow/edit/master/docs/triggers.md)

# Trigger Syntax

For how to define a trigger, see [Workflow Syntax for Actionsflow](/docs/workflow.md)
