---
title: "Getting Started"
metaTitle: "Actionsflow Getting Started"
---

# Quick Started

Actionsflow is basically a three-step process:

1. Create a Github repository by this [link](https://github.com/actionsflow/workflow/generate),
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

For more information about quick started, see [Getting Started](/docs/getting-started.md)

For more information about the Actionsflow triggers, see [Triggers](/docs/triggers.md)

For more information about the Actionsflow workflow file, see the
[Actionsflow workflow reference](/docs/reference.md).

You can learn more about use cases in [Examples](https://github.com/actionsflow/actionsflow/tree/master/examples/workflows).

For more questions about Actionsflow, see [FAQs](/docs/faqs.md)
