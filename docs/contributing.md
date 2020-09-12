---
title: "Contributing Guide"
metaTitle: "Contributing to Actionsflow"
---

Great that you are here and you want to contribute to [Actionsflow](https://github.com/actionsflow/actionsflow)

# Docs Contributions

> I appreciate that you want to contribute to the docs, I have to say that I'm not a native English speaker, maybe there are some sentences that don’t make sense. I really appreciate it if you can improve this document.

When working on the Actionsflow documentation, you can choose between two major styles of working:

- Work directly in the [GitHub UI](https://github.com/actionsflow/actionsflow/tree/master/docs), using the “Edit this File” and commit capabilities without having to clone the repository. This is useful for quick documentation updates, typo fixes, and lightweight Markdown changes.
- Clone the [Actionsflow](https://github.com/actionsflow/actionsflow) repo.

Some tips:

- if you need use link the internal docs at Actionsflow, you should always use `/docs/about.md` format to link the other doc, then the doc site will be built as expected
- we use [remark lint](https://github.com/remarkjs/remark-lint) as our markdown document lint, the config is [here](https://github.com/actionsflow/actionsflow/blob/master/.remarkrc.js), run `npm run lint` will checking the document format. It will run lint automatically before you commit.

# Code Contributions

Actionsflow is developed by [Typescript](https://www.typescriptlang.org/), so you should use [Typescript](https://www.typescriptlang.org/) to contribute codes.

## Directory Structure

Actionsflow is split up in different modules which are all in a single mono repository.

The most important directories:

- `/packages` - The different Actionsflow modules
- `/packages/actionsflow` - Core code witch build workflows and handles triggers
- `/packages/actionsflow-core` - Core code which provide core utils
- `/packages/actionsflow-cli` - CLI code, which is alias of `actionsflow`
- `/packages/actionsflow-action` - Github actions for Actionsflow
- `/packages/actionsflow-interface` - Common interfaces
- `/examples` - workflows examples
- `/examples/actionsflow-workflow-example` - example workflow

## Setup

1. Fork the [repository](https://github.com/actionsflow/actionsflow)

   ```bash
   # You should replace the repository to yours
   git clone https://github.com/actionsflow/actionsflow.git
   ```

1. Go into repository folder

   ```bash
   cd actionsflow
   ```

1. Install all dependencies of all modules & Link them together

   ```bash
   npm i
   ```

1. Bootstrap

   ```bash
   npm run bootstrap
   ```

1. start and watch codes changes:

   ```bash
   npm run start
   ```

### Test

```bash
npm run test

```

# Run example workflows

Build all `examples/actionsflow-workflow-example` workflows:

> If you need to build all workflow files, you should create `.env` file at `examples/actionsflow-workflow-example` directory with follow content, some workflow files depend on these secrets:
> `JSON_SECRETS='{"IFTTT_KEY":"place your ifttt webhook key","TELEGRAM_BOT_TOKEN":"place your telegram bot token"}'`

```bash
npm run build:example
```

or you can build a specific workflow file:

```bash
npm run build:example -- -i rss.yml
```

run `act` for run workflows local, you should install [act](https://github.com/nektos/act) first.

```bash
npm run act:example
```

clean build files and cache:

```bash
npm run clean:example
```

## Development Cycle

While iterating on Actionsflow modules code, you can run `npm run start`. It will then
automatically build your code, rebuild on every change you make.

1.  Start Actionsflow in development mode: `npm run start`
1.  hack, hack, hack
1.  Create tests
1.  Run all tests, `npm run test`
1.  Commit code and create a pull request(you can use `npm run cm` to commit)

## Create Trigger

It is really easy to create a trigger of Actionsflow, see [here](/docs/creating-triggers.md)
