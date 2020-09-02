---
title: "Workflow syntax for Actionsflow"
metaTitle: "Workflow syntax for Actionsflow"
---

Like [Github actions workflow](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions), A Actionsflow workflow is a configurable automated process made up of one or more jobs. You must create a YAML file to define your workflow configuration. The Actionsflow configuration format is the same as [Github actions](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow)

Workflow files use YAML syntax and must have either a `.yml` or `.yaml` file extension. If you're new to YAML and want to learn more, see "[Learn YAML in five minutes.](https://www.codeproject.com/Articles/1214409/Learn-YAML-in-five-minutes)"

You must store workflow files in the `workflows` directory of your repository.

# on

Required, The name of the Actionsflow event that triggers the workflow. You should provide a trigger configuration map to watch the trigger updating.

For a list of available triggers, see "[Triggers](/docs/triggers.md)"

**Example using RSS trigger**

```yaml
on:
  rss:
    url: https://hnrss.org/newest?points=300
```

## Context and expression syntax for Actionsflow on

You can access context information in workflow triggers, you need to use specific syntax to tell Actionsflow to evaluate a variable rather than treat it as a string.

```yaml
${{ <context> }}
```

For now, you can use [`secrets`](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets), and [`github`](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#github-context) as trigger's context, the two objects are set by Github actions, you can use them in trigger config. For example:

```yaml
on:
  telegram_bot:
    token: ${{ secrets.TELEGRAM_BOT_TOKEN }}
```

# jobs

A workflow run is made up of one or more jobs. Jobs run in parallel by default. To run jobs sequentially, you can define dependencies on other jobs using the `jobs.<job_id>.needs` keyword.

The jobs configure format is the same as [Github actions jobs](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobs), so you can learn more about jobs at [here](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobs)

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

## Context and expression syntax for Actionsflow jobs

You can access context information in workflow jobs, you need to use specific syntax to tell Actionsflow to evaluate a variable rather than treat it as a string.

```yaml
${{ <context> }}
```

All [Github actions contexts and expressions](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions) are supported by Actionsflow, and we extend the context as follows:

```yaml
${{ on.<trigger_name>.outputs.<key> }}
```

For a list of available triggers, see "[Triggers](/docs/triggers.md)", you can find params and outputs keys supported by the trigger at the trigger's doc.
