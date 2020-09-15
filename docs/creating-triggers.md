---
title: Creating Triggers
metaTitle: Creating an Actionsflow Trigger
---

You may be looking to build and perhaps publish a trigger that doesn't exist yet, or you may just be curious to know more about the anatomy of a Actionsflow trigger (file structure, etc).

# Core concepts

- Each Actionsflow trigger can be created as an npm package or as a [local trigger](/docs/creating-triggers/creating-a-local-trigger.md)
- Trigger exports a class with `run` method for getting the initial results.

A typical trigger class looks like this:

```javascript
module.exports = class Example {
  constructor({ helpers, options }) {
    this.options = options;
    this.helpers = helpers;
  }
  async run() {
    const items = [
      {
        id: "uniqueId",
        title: "hello world title",
      },
    ];
    return items;
  }
};
```

# Naming a trigger

An Actionsflow trigger name looks like **`@actionsflow/trigger-*`**, for example: [`@actionsflow/trigger-twitter`](https://github.com/actionsflow/actionsflow/tree/master/packages/actionsflow-trigger-twitter), then you can this trigger after install it:

```yaml
on:
  twitter:
    event: user_timeline
```

> if your trigger name is more than one word, snake case format is recommended for a trigger name, because the jobs use trigger's outputs by `on.trigger_name.outputs.param`, if your trigger is named `trigger-name`, then the jobs should use trigger's outputs by `on['trigger-name'].outputs.param`. Snake case is also Github actions naming conventions, like `pull_request`, it's also Actionsflow trigger recommended naming conventions.

# Options styles

Follow the Javascript name styles, we recommend you use camel case as the options field name style. For example:

```javascript
{
  skipFirst: true,
  deduplicationKey: "id"
}
```

# Start to build a trigger

This section of the docs includes the following guides:

- [Creating a Generic Trigger](/docs/creating-triggers/creating-a-generic-trigger.md)
- [Creating a Local Trigger](/docs/creating-triggers/creating-a-local-trigger.md)
- [Triggers API](/docs/reference/0-trigger-api.md)
