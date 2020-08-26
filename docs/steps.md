---
title: "Job Steps"
metaTitle: "Actionsflow job steps"
---

Actionsflow support almost all [Github actions](https://github.com/marketplace?type=actions) by using [act](https://github.com/nektos/act).

A typical job steps look like this:

```yaml
jobs:
  ifttt:
    name: Make a Request to IFTTT
    runs-on: ubuntu-latest
    steps:
      - uses: actionsflow/ifttt-webhook-action@v1
        with:
          event: notice
          key: ${{ secrets.IFTTT_KEY }}
          value1: ${{ on.rss.outputs.title }}
          value2: ${{ on.rss.outputs.contentSnippet }}
          value3: ${{ on.rss.outputs.link }}
```

The configure format is same with [Github actions jobs](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions), you can use any [context and expression of Github actions](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions), and the other expression supported by Actionsflow, like trigger's outputs, for example: `${{ on.rss.outputs.title }}`

Like Github actions, you can also define multiple jobs for your workflow. For example:

```yaml
jobs:
  ifttt:
    name: Make a Request to IFTTT
    runs-on: ubuntu-latest
    steps:
      - uses: actionsflow/ifttt-webhook-action@v1
        with:
          event: notice
          key: ${{ secrets.IFTTT_KEY }}
          value1: ${{ on.rss.outputs.title }}
          value2: ${{ on.rss.outputs.contentSnippet }}
          value3: ${{ on.rss.outputs.link }}
  ifttt2:
    name: Make a Request to IFTTT
    runs-on: ubuntu-latest
    steps:
      - uses: actionsflow/ifttt-webhook-action@v1
        with:
          event: notice
          key: ${{ secrets.IFTTT_KEY }}
          value1: ${{ on.rss.outputs.title }}
          value2: ${{ on.rss.outputs.contentSnippet }}
          value3: ${{ on.rss.outputs.link }}
```

Learn more information about job steps format, please see [Workflow syntax for GitHub Actions
](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)

For exploring more actions, please see [Github Actions Marketplace](https://github.com/marketplace?type=actions)
