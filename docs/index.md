---
title: "Introduction"
metaTitle: "Actionsflow Introduction"
---

[Actionsflow](https://github.com/actionsflow/actionsflow) helps you to automate workflows, it's the best [IFTTT](https://ifttt.com/)/[Zapier](https://zapier.com/) free alternative for developers. With [Actionsflow](https://github.com/actionsflow/actionsflow), you can connect your favorite apps, data, and APIs, receive notifications of actions as they occur, sync files, collect data, and more. We implemented it based on [Github actions](https://docs.github.com/en/actions), and you use a YAML file (The configuration format is the same as [Github actions](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow)) to build your workflows. If you have already written a [Github actions file](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow), it's really easy to define an Actionsflow workflow file, and you can use any [Github actions](https://github.com/marketplace?type=actions) as your job's steps.

You can see the core concepts of Actionsflow at [here](/docs/concepts.md).

# Features

- **Totally Free!** Actionsflow based on [Github actions](https://docs.github.com/en/actions). To run an Actionsflow workflow, all you need to do is [creating a repository from the Actionsflow template repository](https://github.com/actionsflow/workflow/generate).
- **Enjoy with Community Triggers**. You can use many [triggers provided by the community](/docs/triggers.md#triggers-list), you can also [create your own triggers](/docs/create-trigger.md) easily.
- **Support Almost ALL Actions of [Github Actions](https://github.com/marketplace?type=actions)**. Actionsflow use [act](https://github.com/nektos/act)(a tool for running GitHub Actions locally) for running jobs of your workflow file. With [Github actions](https://github.com/marketplace?type=actions), You can connect with IFTTT, Zapier, or the other services.
- **Easy for Writing Workflow File**. The Actionsflow configuration format is the same as [Github actions](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow), If you have already written a [Github actions file](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow) before, it's really easy for you to define an Actionsflow workflow file
- **Run a trigger per 5 minutes**. The workflow can check and run every 5 minutes based on [Github actions scheduled events](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#scheduled-events)
- **Use Webhook to Connect with any 3rd party Service**. You can easily set a webhook URL at 3rd party service, then receive the webhook event at triggers who supported the webhook.

# Quick Started

Build an Actionsflow workflow is a three-step process:

1. Create a public Github repository by this [link](https://github.com/actionsflow/actionsflow-workflow-default/generate)
1. Define your [workflow files](https://actionsflow.github.io/docs/workflow/) at `workflows` directory, you can explore [trigger list](https://actionsflow.github.io/docs/triggers/) or [workflows by use case](https://actionsflow.github.io/docs/explore/)
1. commit and push your updates to Github

Then, Actionsflow will run your workflows as you defined, you can view logs at your repository actions tab at [Github](https://github.com)

For more information about quick started, see [Getting Started](/docs/getting-started.md)

# Structure

A typical Actionsflow repository structure looks like this:

```sh
.
├── .github
│   └── workflows
│       └── actionsflow-jobs.yml
├── .gitignore
├── README.md
└── workflows
│   └── rss.yml
│   └── webhook.yml
└── package.json
```

You should place your workflow files at `workflows` folder, and you can install the 3rd party triggers at `package.json` or create your own trigger at `triggers` folder.

Take a look with the Actionsflow [official workflow template repository](https://github.com/actionsflow/actionsflow-workflow-default)

# Workflow File

A typical workflow file `workflow.yml` looks like this:

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
[Actionsflow workflow reference](/docs/workflow.md).

For more information about the Actionsflow triggers, see [Triggers](/docs/triggers.md)

For more information about use cases, see [Examples](https://github.com/actionsflow/actionsflow/tree/master/examples/actionsflow-workflow-example).

For more questions about Actionsflow, see [FAQs](/docs/faqs.md)
