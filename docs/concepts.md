---
title: "Core concepts"
metaTitle: "Actionsflow Getting Started"
---

# How Actionsflow worked?

Simply, Actionsflow setup a Github scheduled action with running every 5 minutes, Actionsflow will check if there are any updates with the triggers in the workflows, if Actionsflow found an updated item, it will generate a standard Github actions workflow file with the item payload, and call [act](https://github.com/nektos/act) to run the built workflow.
