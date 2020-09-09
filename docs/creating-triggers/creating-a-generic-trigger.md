---
title: Creating a Generic Trigger
metaTitle: Creating an Actionsflow Generic Trigger
---

A trigger contain a file, usually in the project root, called `package.json` - this file holds various metadata relevant to the project. The `package.json` file is also used to provide information to npm that identifies the project and allows npm to handle the project's dependencies.

An Actionsflow trigger name looks like **`@actionsflow/trigger-*`**, for example: [`@actionsflow/trigger-twitter`](https://github.com/actionsflow/actionsflow/tree/master/packages/actionsflow-trigger-twitter), you should name your trigger with **`@actionsflow/trigger-[name]`**.

> if your trigger name is more than one word, snake case format is recommended for a trigger name, because the jobs use trigger's outputs by `on.trigger_name.outputs.param`, if your trigger is named `trigger-name`, then the jobs should use trigger's outputs by `on['trigger-name'].outputs.param`. Snake case is also Github actions naming conventions, like `pull_request`, it's also Actionsflow trigger recommended naming conventions.

## Initializing your trigger project

To initialize a `package.json` for your project, run the following command:

```shell
npm init
```

Once you've run the command you'll see a series of options listed in the command-line interface (CLI). Those you select are stored in your `package.json`
