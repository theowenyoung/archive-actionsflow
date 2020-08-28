---
title: Actionsflow core API
---

This document is for [npm actionsflow package](https://www.npmjs.com/package/actionsflow), you can use `actionsflow` by API or CLI.

Here is the Actionsflow core API docs, you can see [CLI docs at here](/docs/reference/3-cli.md)

## Install

```bash
npm i actionsflow --save

# or

yarn add actionsflow
```

# build

Build Actionsflow workflow files to standard Github actions workflow files

```typescript
import { build } from "actionsflow";

function build(options: {
  base?: string; // base workspace folder, default is process.cwd()
  workflows?: string; // Actionsflow workflow files path, default valid is 'workflows'
  dest?: string; // dest folder, default value is 'dist', the standard Github actions workflow files will place to `./dist/workflows`
  logLevel?: LogLevelDesc; // Log level, default is "info", you can use one of these values, "trace" | "debug" | "info" | "warn" | "error" | "silent"
}): Promise<void>;
```

# clean

Clean the dist fokder and cache

```typescript
import { clean } from "actionsflow";

function clean (options: {
  dest?: string; // dest folder, default value is 'dist'
  base?: string; // base workspace folder, default is process.cwd()
  logLevel?: Log.LogLevelDesc; // Log level, default is "info", you can use one of these values, "trace" | "debug" | "info" | "warn" | "error" | "silent"
}): Promise<void>;
};
```
