---
title: "Workflow Syntax"
metaTitle: "Workflow Syntax for Actionsflow"
---

Like [Github actions workflow](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions), A Actionsflow workflow is a configurable automated process made up of one or more jobs. You must create a YAML file to define your workflow configuration. The Actionsflow configuration format is the same as [Github actions](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow)

Workflow files use YAML syntax and must have either a `.yml` or `.yaml` file extension. If you're new to YAML and want to learn more, see "[Learn YAML in five minutes.](https://www.codeproject.com/Articles/1214409/Learn-YAML-in-five-minutes)"

You must store workflow files in the `workflows` directory of your repository.

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

The following doc will show you about workflow syntax:

# `on`

Required, The name of the Actionsflow trigger. Triggers are how your workflows can start automated workflows whenever they add or update something in your workflow.

For a list of available triggers, see "[Triggers](/docs/triggers.md)"

Example using RSS trigger:

```yaml
on:
  rss:
    url: https://hnrss.org/newest?points=300
```

**Context and expression syntax for Actionsflow on**:

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

## `on.<trigger_name>`

Optional, the options of the trigger, the default value is `{}`, You can find the trigger's documentation for getting the available params.

## `on.<trigger_name>.config`

Optional, you can use `config` to configure the general options for Actionsflow trigger. These options are handled by Actionsflow, so all triggers accept these options.

For example:

```yaml
on:
  rss:
    url: https://hnrss.org/newest?points=300
    config:
      maxItemsCount: 15
```

The `config` has the following options.

### `on.<trigger_name>.config.active`

Optional, `boolean`, if the trigger is active, default is `true`. for some reason, you can make trigger inactive by set `active: false`

### `on<trigger_name>.config.every`

Optional, `number`, polling data interval time, the unit is minute, the default value is `5`

### `on<trigger_name>.config.skipFirst`

Optional, `boolean`, whether to skip the data obtained for the first time, if `true`, the trigger will run the next time it get data. The default value is `false`

### `on<trigger_name>.config.maxItemsCount`

Optional, the trigger's results max length, the default value is `undefined`, it means the trigger will trigger all items

### `on<trigger_name>.config.shouldDeduplicate`

Optional, `boolean`, if the trigger's results should be dedeplicate, the default value is decided by the trigger, you can force to override it.

### `on<trigger_name>.config.force`

Optional, `boolean`, whether to force data to be updated, if `true`, the trigger will ignore cache, and last update time. The default value is `false`

### `on<trigger_name>.config.continueOnError`

Optional, `boolean`, Set to `true`, Actionsflow will generate a `outcome: true` workflow from failing when a trigger fails. The default value is `false`, Actionsflow will ignore the trigger for this time if there are any fails.

### `on<trigger_name>.config.logLevel`

Optional, `string`, log level for trigger, the default value is `info`, you can use `trace`, `debug`, `info`, `warn`, `error`

## `on.<trigger_name>.<param>`

Optional, the trigger's options, defined by the specific trigger, you should read the trigger's documentation to get all options that available for the trigger. For [`rss`](/docs/triggers/0-rss.md) example:

```yaml
on:
  rss:
    url: https://hnrss.org/newest?points=300
    config:
      maxItemsCount: 15
```

# `jobs`

A workflow run is made up of one or more jobs. Jobs run in parallel by default. To run jobs sequentially, you can define dependencies on other jobs using the `jobs.<job_id>.needs` keyword.

The jobs configure format is the same as [Github actions jobs](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobs), so you can learn more about jobs at [here](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobs)

Actionsflow support almost all [Github actions](https://github.com/marketplace?type=actions) by using [act](https://github.com/nektos/act)(a tool for running GitHub Actions locally).

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

For exploring more actions, please see [Awesome Actions List we Collected](/docs/actions.md) and [Github Actions Marketplace](https://github.com/marketplace?type=actions)

**Context and expression syntax for Actionsflow jobs**:

You can access context information in workflow jobs, you need to use specific syntax to tell Actionsflow to evaluate a variable rather than treat it as a string.

```yaml
${{ <context> }}
```

All [Github actions contexts and expressions](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions) are supported by Actionsflow, and we extend `on` context for trigger's results. You can use it like this:

```yaml
${{ on.<trigger_name>.outputs.<key> }}
```

You can find params and outputs keys supported by the trigger at the trigger's doc.

All triggers' will export the following key:

## `on.<trigger_name>.outputs`

A map of outputs for a trigger results' item. Trigger's outputs are available to all jobs.

Trigger's outputs are `object`, you can use it like this: `${{ on.telegram_bot.from.first_name }}`

## `on.<trigger_name>.outcome`

The result of a completed trigger, Possible values are `success`, `failure`, or `skipped`.

By default(if there is only one trigger at a workflow file), `outcome` is always `success` unless you set the trigger options `continueOnError: true`, then when a `continueOnError` trigger fails, the `outcome` is `failure`, but the final `conclusion`is `success`.

If you set multiple triggers on one workflow, only one trigger's `outcome` is `success`, the others `outcome` will be `skipped`, so you should use `if: on.<trigger_name>.outcome === 'success'` to ensure the current `<trigger_name>.outputs.<key>` is available.

## `on.<trigger_name>.conclusion`

The result of a completed step after `continueOnError` is applied. Possible values are `success`, `failure`, or `skipped`.

By default(if there is only one trigger at a workflow file), `conclusion` is always `success` unless you set the trigger options `continueOnError: true`, then when a `continueOnError` trigger fails, the `outcome` is `failure`, but the final `conclusion`is `success`.

## Triggers

For a list of available triggers, see "[Triggers List](/docs/triggers.md)"
