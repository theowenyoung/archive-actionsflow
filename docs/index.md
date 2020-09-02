---
title: "Introduction"
metaTitle: "Actionsflow introduction"
---

[Actionsflow](https://github.com/actionsflow/actionsflow) helps you to automate workflows, it's the best [IFTTT](https://ifttt.com/)/[Zapier](https://zapier.com/) free alternative for developers. With [Actionsflow](https://github.com/actionsflow/actionsflow), you can connect your favorite apps, data, and APIs, receive notifications of actions as they occur, sync files, collect data, and more. , We implemented it based on [Github actions](https://docs.github.com/en/actions), and you use a YAML file (The configuration format is the same as [Github actions](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow)) to build your workflows. If you have already written a [Github actions file](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow), it's very easy to define an Actionsflow workflow file, and you can use any [Github actions](https://github.com/marketplace?type=actions) as your job's steps.

You can see the core concepts of Actionsflow at [here](#howactionsflowworked).

# Features

- **Totally Free!** Actionsflow based on [Github actions](https://docs.github.com/en/actions). To run an Actionsflow workflow, you just need to [create a repository from Actionsflow template repository](https://github.com/actionsflow/workflow/generate).
- **Support almost all actions of Github**, you can use almost all [Github actions](https://github.com/marketplace?type=actions). Actionsflow use [act](https://github.com/nektos/act) for running [Github actions](https://github.com/marketplace?type=actions). With [Github actions](https://github.com/marketplace?type=actions), You can connect with IFTTT, Zapier, or the other services.
- **Easy to write workflow file**, the Actionsflow configuration format is the same as [Github actions](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow), If you have already written a [Github actions file](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow), it's very easy to define an Actionsflow workflow file
- **Run a trigger every 5 minutes**. The workflow can check and run every 5 minutes based on [Github actions scheduled events](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#scheduled-events)

# Quick Started

Build an Actionsflow workflow is basically a three-step process:

1. Create a public Github repository by this [link](https://github.com/actionsflow/workflow/generate)
1. Define your [workflow files](/docs/workflow.md) at `workflows` directory, you can find some workflow file examples at [here](https://github.com/actionsflow/actionsflow/tree/master/examples/workflows)
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
[Actionsflow workflow reference](/docs/workflow.md).

For more information about the Actionsflow triggers, see [Triggers](/docs/triggers.md)

For more information about use cases, see [Examples](https://github.com/actionsflow/actionsflow/tree/master/examples/workflows).

For more questions about Actionsflow, see [FAQs](/docs/faqs.md)

# How Actionsflow worked

Actionsflow setup a Github scheduled action with running every 5 minutes, Actionsflow will check if there are any updates with the triggers in the workflows, if Actionsflow found an updated item, it will generate a standard Github actions workflow file with the item payload, and call [act](https://github.com/nektos/act) to run the built workflow.
