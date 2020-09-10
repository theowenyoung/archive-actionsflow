---
title: "Core Concepts"
metaTitle: "Actionsflow Getting Started"
---

# How Actionsflow worked

Actionsflow setup a Github scheduled action with running every 5 minutes, Actionsflow will check if there are any updates with the triggers in the workflows, if Actionsflow found an updated item, it will generate a standard Github actions workflow file with the item payload, and call [act](https://github.com/nektos/act) to run the built workflow.

# What Actionsflow include

A typical Actionsflow workflow includes a [trigger](/docs/triggers.md) and some [job steps](/docs/steps.md)(Actionsflow also support multiple triggers and multiple jobs), when a trigger is triggered, Actionsflow will run jobs you defined at the [workflow file](/docs/workflow.md).
