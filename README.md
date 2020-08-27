<p align="center">
  <a href="https://actionsflow.github.io" rel="noopener">
 <img width=200px height=200px src="./docs/assets/logo.svg" alt="Project logo"></a>
</p>

<h1 align="center">Actionsflow</h1>

<div align="center">

[![Build](https://github.com/actionsflow/actionsflow/workflows/Build/badge.svg)](https://github.com/actionsflow/actionsflow/actions?query=workflow%3ABuild)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/actionsflow/actionsflow.svg)](https://github.com/actionsflow/actionsflow/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/actionsflow/actionsflow.svg)](https://github.com/actionsflow/actionsflow/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center">
<strong>The best <a href="https://ifttt.com/">IFTTT</a>/<a href="https://zapier.com/">Zapier</a> free alternative for developers to automate your workflows based on Github actions</strong>
<br>
</p>

## 📝 Table of Contents

- [About](#about)
- [Document](#document)
- [How Actionsflow Worked](#howactiionsflowworked)
- [Getting Started](#getting_started)
- [Contributing](#contributing)
- [Authors](#authors)

## 🧐 About <a name = "about"></a>

[Actionsflow](https://github.com/actionsflow/actionsflow) helps you to automate workflows, it's the best [IFTTT](https://ifttt.com/)/[Zapier](https://zapier.com/) free alternative for developers. With [Actionsflow](https://github.com/actionsflow/actionsflow), you can connect your favorite apps, data, and APIs, receive notifications of actions as they occur, sync files, collect data, and more. , We implemented it based on [Github actions](https://docs.github.com/en/actions), and you use a YAML file (The configuration format is the same as [Github actions](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow)) to build your workflows. If you have already written a [Github actions file](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow), it's very easy to define an Actionsflow workflow file, and you can use any [Github actions](https://github.com/marketplace?type=actions) as your job's steps.

You can see core concepts of Actionsflow at [here](#howactionsflowworked).

## 🔥 Features

- **Totally Free!** Actionsflow based on [Github actions](https://docs.github.com/en/actions). To run an Actionsflow workflow, you just need to [create a repository from Actionsflow template repository](https://github.com/actionsflow/workflow/generate).
- **support almost all actions of github**, you can use almost all [Github actions](https://github.com/marketplace?type=actions). Actionsflow use [act](https://github.com/nektos/act) for running [Github actions](https://github.com/marketplace?type=actions). With [Github actions](https://github.com/marketplace?type=actions), You can connect with IFTTT, Zapier, or the other services.
- **Easy to write workflow file**, the Actionsflow configuration format is the same as [Github actions](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow), If you have already written a [Github actions file](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow), it's very easy to define an Actionsflow workflow file,
- **Run a trigger every 5 minutes**. The workflow can check and run every 5 minutes based on [Github actions scheduled events](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#scheduled-events)

## 🎓 Document <a name="document"></a>

Full documentation for Actionsflow lives [on the website](https://actionsflow.github.io/docs/).

You can also [view it at Github](/docs/index.md) if you prefer.

## 👀 How Actionsflow worked <a name = "howactiionsflowworked"></a>

Actionsflow setup a Github scheduled action with running every 5 minutes, Actionsflow will check if there are any updates with the triggers in the workflows, if Actionsflow found an updated item, it will generate a standard Github actions workflow file with the item payload, and call [act](https://github.com/nektos/act) to run the built workflow.

## 🏁 Getting Started <a name = "getting_started"></a>

Build an Actionsflow workflows is basically a three-step process:

1. Create a public Github repository by this [link](https://github.com/actionsflow/workflow/generate)
1. Define your [workflow files](/docs/reference/0-workflow-syntax.md) at `workflows` directory, you can find some workflow file examples at [here](https://github.com/actionsflow/actionsflow/tree/master/examples/workflows)
1. commit and push your updates to Github

Then, Actionsflow will run your workflows as you defined, you can view logs at your repository actions tab at [Github](https://github.com)

For more information about quick started, see [Getting Started](/docs/getting-started.md)

### Structure

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

### Workflow File

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

For more questions about Actionsflow, see [FAQs](./docs/faqs.md)

## 🤝 How to Contribute <a name = "contributing"></a>

Whether you're helping us fix bugs, improve the docs, or spread the word, we'd love to have you as part of the Actionsflow community! 💪💜

Check out our [Contributing Guide](/docs/contributing.md) for ideas on contributing and setup steps for getting our repositories up and running on your local machine.

## ✍️ Authors <a name = "authors"></a>

- [@theowenyoung](https://github.com/theowenyoung) - Idea & Initial work

See also the list of [contributors](https://github.com/actionsflow/actionsflow/contributors) who participated in this project.

## 📝 License

Licensed under the [MIT License](./LICENSE).
