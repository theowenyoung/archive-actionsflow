---
title: "Introduction"
metaTitle: "Actionsflow introduction"
---

Actionsflow is a tool for developers to build and run workflows. Like [IFTTT](https://ifttt.com/), [Zapier](https://zapier.com/), with [Actionsflow](https://github.com/actionsflow/actionsflow)
you can run a workflow that is triggered by RSS, Webhook, Poll, Telegram Bot, and the other triggers that actionsflow supported. we implemented it by using [Github actions](https://docs.github.com/en/actions), and you use a YAML file (The configuration format is the same as [Github actions](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow) ) to build your workflows. It's easy to configure, and you can use any [Github actions](https://github.com/marketplace?type=actions) as your actions.

You can see core concepts of Actionflow at [here](/docs/concepts.md).

# Features

- **Totally Free!** Actionsflow use [Github actions](https://docs.github.com/en/actions) as base service, so, Actionsflow workflows is just a repository at [Github](https://github.com/).
- **support almost all actions of github**, you can use almose all [Github actions](https://github.com/marketplace?type=actions), Actionsflow use [act](https://github.com/nektos/act) for running [Github actions](https://github.com/marketplace?type=actions). With the [Github actions](https://github.com/marketplace?type=actions), You can connect with IFTTT, Zapier, or the other connectors.
- **Easy for write workflow file**, the Actionsflow configuration format is the same as [Github actions](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow)
- **Run a trigger every 5 minutes**, you can get updates like RSS,Poll every 5 minutes

# Quick Started

Actionsflow is basically a three-step process:

1. Create a Github repositoy by this [link](https://github.com/actionsflow/workflow/generate),

1. Define your workflow files at `workflows` directory.

1. push your updates to Github

A workflow file `xxx.yml` looks like this:

```yaml
on:
  rss:
    event: new_item
    url: https://hnrss.org/newest?points=300
jobs:
  ifttt:
    name: Make a Request to IFTTT
    runs-on: ubuntu-latest
    steps:
      - uses: actionsflow/ifttt-webhook-action@v1
        with:
          event: notice
          key: ${{ secrets.IFTTT_KEY }}
          value1: ${{on.rss.outputs.title}}
          value2: ${{on.rss.outputs.contentSnippet}}
          value3: ${{on.rss.outputs.link}}
```

For more information about quick start, see [Getting Started](/docs/getting-started.md)

For more information about the Actionsflow triggers, see [Triggers](/docs/triggers.md)

For more information about the Actionsflow workflow file, see the
[Actionsflow workflow reference](/docs/reference.md).

You can learn more about use cases in [Examples](https://github.com/actionsflow/actionsflow/tree/master/examples/workflows).

For more questions about Actionsflow, see [FAQs](/docs/faqs.md)
