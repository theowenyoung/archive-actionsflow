---
title: "Introduction"
metaTitle: "Actionsflow Introduction"
---

[Actionsflow](https://github.com/actionsflow/actionsflow) helps you to automate workflows, it's the best [IFTTT](https://ifttt.com/)/[Zapier](https://zapier.com/) free alternative for developers. With [Actionsflow](https://github.com/actionsflow/actionsflow), you can connect your favorite apps, data, and APIs, receive notifications of actions as they occur, sync files, collect data, and more. We implemented it based on [Github actions](https://docs.github.com/en/actions), and you use a YAML file (The configuration format is the same as [Github actions](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow)) to build your workflows. If you have already written a [Github actions file](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow), it's really easy to define an Actionsflow workflow file, and you can use any [Github actions](https://github.com/marketplace?type=actions) as your job's steps.

You can see the core concepts of Actionsflow at [here](./concepts.md).

# Features

- **Totally Free!** Actionsflow based on [Github actions](https://docs.github.com/en/actions). To run an Actionsflow workflow, all you need to do is [creating a repository from the Actionsflow template repository](https://github.com/actionsflow/actionsflow-workflow-default/generate).
- **Enjoy with Community Triggers**. You can use many [triggers provided by the community](./triggers.md#triggers-list), you can also [create your own triggers](./creating-triggers.md) easily.
- **Support Almost ALL Actions of [Github Actions](https://github.com/marketplace?type=actions)**. Actionsflow use [act](https://github.com/nektos/act)(a tool for running GitHub Actions locally) for running jobs of your workflow file. With [Github actions](https://github.com/marketplace?type=actions), You can connect with IFTTT, Zapier, or the other services.
- **Easy for Writing Workflow File**. The Actionsflow configuration format is the same as [Github actions](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow), If you have already written a [Github actions file](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow) before, it's really easy for you to define an Actionsflow workflow file
- **Run a trigger per 5 minutes**. The workflow can check and run every 5 minutes based on [Github actions scheduled events](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#scheduled-events)
- **Use Webhook to Connect with any 3rd party Service**. You can easily set a webhook URL at 3rd party service, then receive the webhook event at triggers who supported the webhook.
- **Support complex workflows**. With Actionsflow, you can make complex advanced workflows. Actionsflow providers a [MongoDB query language](./workflow.md#ontriggerconfigfilter) for you to filter your data as you want.

# Quick Started

Build an Actionsflow workflow is a three-step process:

1. **Create a public Github repository by this [link](https://github.com/actionsflow/actionsflow-workflow-default/generate).**

   A typical Actionsflow repository structure looks like this:

   ```sh
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

1. **Define your [workflow file](./workflow.md) at `workflows` directory**

   A typical workflow file `rss.yml` looks like this:

   ```yaml
   on:
     rss:
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
   [Actionsflow workflow reference](./workflow.md).

   You can explore [Triggers List](./triggers.md) or [Workflows by Use Case](./explore.md) to get more inspired.

1. **commit and push your updates to Github**

Then, Actionsflow will run your workflows as you defined, you can view logs at your repository actions tab at [Github](https://github.com)

For more information about quick started, see [Getting Started](./getting-started.md)

# Learn More

- [Workflow Syntax for Actionsflow](./workflow.md) - Learn more about the Actionsflow workflow file syntax
- [Triggers List](./triggers.md) - Explore Actionsflow triggers
- [Workflows Use Case](./explore.md) - Explore Actionsflow workflows use case to get inspired
- [Core Concepts](./concepts.md) - Learn more about how Actionsflow worked
- [Creating Triggers for Actionsflow](./creating-triggers.md) - Learn more about how to create your own trigger for Actionsflow
- [FAQs](./faqs.md) - Actionsflow FAQs
