---
title: Actions API
metaTitle: Actionsflow Actions API
---

Actionsflow action for Github. With this action, you can use Actionsflow without `node_modules`. It can speed up your workflow.

## Inputs

```yaml
inputs:
  cwd:
    description: "base workspace folder, default is current workspace"
    required: false
  dest:
    description: "dest folder, the default value is 'dist', the standard Github actions workflow files will place to ./dist/workflows"
    required: false
    default: "dist"
  logLevel:
    description: 'Log level, default is "info", you can use one of these values, "trace" | "debug" | "info" | "warn" | "error" | "silent"'
    required: false
    default: "info"
  force:
    description: "force update all triggers, it will ignore the update interval and cached deduplicate key"
    required: false
    default: "false"
```

## Outputs

```yaml
outputs:
  success:
    description: "If the build status is a success, the value can be 'true', or 'false', if the build failed, the action outcome will be set failed"
```

## Example usage

```yaml
uses: actionsflow/actionsflow@v1
with:
  log-level: "debug"
```
