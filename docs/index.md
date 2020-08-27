---
title: "Introduction"
metaTitle: "Actionsflow introduction"
---

[Actionsflow](https://github.com/actionsflow/actionsflow) is a tool for developers to build and run workflows. Like [IFTTT](https://ifttt.com/), [Zapier](https://zapier.com/), with [Actionsflow](https://github.com/actionsflow/actionsflow), you can run a workflow that is triggered by RSS, Webhook, Poll, Telegram Bot, and the other triggers that Actionsflow supported. we implemented it by using [Github actions](https://docs.github.com/en/actions), and you use a YAML file (The configuration format is the same as [Github actions](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow) ) to build your workflows. It's easy to configure, and you can use any [Github actions](https://github.com/marketplace?type=actions) as your job's steps.

You can see core concepts of Actionsflow at [here](#howactionsflowworked).

# Features

- **Totally Free!** Actionsflow use [Github actions](https://docs.github.com/en/actions) as base service, so, Actionsflow workflows is just a repository at [Github](https://github.com/).
- **support almost all actions of github**, you can use almost all [Github actions](https://github.com/marketplace?type=actions), Actionsflow use [act](https://github.com/nektos/act) for running [Github actions](https://github.com/marketplace?type=actions). With the [Github actions](https://github.com/marketplace?type=actions), You can connect with IFTTT, Zapier, or the other connectors.
- **Easy for write workflow file**, the Actionsflow configuration format is the same as [Github actions](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow)
- **Run a trigger every 5 minutes**, you can get updates like RSS,Poll every 5 minutes

# Quick Started

Build an Actionsflow workflows is basically a three-step process:

1. Create a public Github repository by this [link](https://github.com/actionsflow/workflow/generate)
1. Define your [workflow files](/docs/reference.md) at `workflows` directory, you can find some workflow file examples at [here](https://github.com/actionsflow/actionsflow/tree/master/examples/workflows)
1. commit and push your updates to Github

Then, Actionsflow will run your workflows as you defined, you can view logs at your repository actions tab at [Github](https://github.com)

For more information about quick started, see [Getting Started](/docs/getting-started.md)

# Structure

A typical Actionsflow repository structure looks like this:

```sh
.
├── .github
│   └── workflows
│       └── actionsflow-jobs.yml
├── .gitignore
├── README.md
└── workflows
    └── rss2ifttt.yml
    └── webhook2ifttt.yml
```

Take a look with the Actionsflow [official template repository](https://github.com/actionsflow/workflow)

# Workflow File

A typical workflow file `xxx.yml` looks like this:

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

For more information about the Actionsflow workflow file, see the
[Actionsflow workflow reference](/docs/reference.md).

For more information about the Actionsflow triggers, see [Triggers](/docs/triggers.md)

For more information about use cases, see [Examples](https://github.com/actionsflow/actionsflow/tree/master/examples/workflows).

For more questions about Actionsflow, see [FAQs](/docs/faqs.md)

# How Actionsflow worked

Actionsflow setup a Github scheduled action with running every 5 minutes, Actionsflow will check if there are any updates with the triggers in the workflows, if Actionsflow found an updated item, it will generate a standard Github actions workflow file with the item payload, and call [act](https://github.com/nektos/act) to run the built workflow.
