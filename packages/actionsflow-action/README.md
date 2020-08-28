# Actionsflow Action

This action build Actionsflow workflow files to dest folder. To learn more about [Actionsflow](https://github.com/actionsflow/actionsflow) please see [Actionsflow Docs](https://actionsflow.github.io/docs/)

## Inputs

```yaml
inputs:
  base:
    description: "base workspace folder, default is current workspace"
    required: false
  workflows:
    description: "Actionsflow workflow files path, default valid is 'workflows'"
    required: false
    default: "workflows"
  dest:
    description: "dest folder, default value is 'dist', the standard Github actions workflow files will place to ./dist/workflows"
    required: false
    default: "dist"
  logLevel:
    description: 'Log level, default is "info", you can use one of these values, "trace" | "debug" | "info" | "warn" | "error" | "silent"'
    required: false
    default: "info"
```

## Outputs

```yaml
outputs:
  success:
    description: "If the build status is success, value can be 'true', or 'false', if build failed, the action outcome will be set failed"
```

## Example usage

```yaml
uses: actionsflow/actionsflow@v1
with:
  log-level: "debug"
```
