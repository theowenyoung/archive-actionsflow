---
title: "Getting Started"
metaTitle: "Actionsflow Getting Started"
---

Get started with Actionsflow, the free, open-source tool for building powerful workflows.

Build an Actionsflow workflow is basically a three-step process:

# 1. Create a Github repository

Click this [link](https://github.com/actionsflow/workflow/generate) to generate a new public Github repository, pick a repository name as you like, for example, `workflow`, `my-workflow`

# 2. Create workflow files

Define your [workflow files](/docs/workflow.md) at `workflows` directory, you can find some workflow file examples at [here](https://github.com/actionsflow/actionsflow/tree/master/examples/workflows)

A typical Actionsflow repository structure looks like this:

```sh
.
├── .github
│   └── workflows
│       └── actionsflow-jobs.yml
├── .gitignore
├── README.md
└── workflows # you should add workflow files at this directory
    └── rss2ifttt.yml
    └── webhook2ifttt.yml
```

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

# 3. Commit and push your updates to Github

You can edit your workflow files online at [Github](https://github.com), so you can submit your commit directly.

Or, you can also clone your repository to local, and submit your commit by command:

```bash
git commit -m "build: edit workflow file" -a
git push
```

Then, Actionsflow will run your workflows as you defined, you can view logs at your repository actions tab at [Github](https://github.com)

For more information about the Actionsflow workflow file, see the
[Actionsflow workflow reference](/docs/workflow.md).

For more information about the Actionsflow triggers, see [Triggers](/docs/triggers.md)

For more information about use cases, see [Examples](https://github.com/actionsflow/actionsflow/tree/master/examples/workflows).

For more questions about Actionsflow, see [FAQs](/docs/faqs.md)
