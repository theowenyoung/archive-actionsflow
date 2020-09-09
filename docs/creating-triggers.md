---
title: Creating Triggers
metaTitle: Creating an Actionsflow Trigger
---

You may be looking to build and perhaps publish a trigger that doesn't exist yet, or you may just be curious to know more about the anatomy of a Actionsflow trigger (file structure, etc).

## Core concepts

- Each Actionsflow trigger can be created as an npm package or as a [local trigger](/docs/creating-triggers/creating-a-local-trigger.md)
- Trigger exports a class with `run` method for getting the initial results.

A typical trigger class looks like this:

```javascript
module.exports = class Example {
  shouldDeduplicate = true;
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
      {
        id: "uniqueId2",
        title: "hello world title2",
      },
    ];
    return {
      items,
    };
  }
};
```

This section of the docs includes the following guides:
