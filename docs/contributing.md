---
title: "Contributing Guide"
metaTitle: "Contributing to Actionsflow"
---

Great that you are here and you want to contribute to [Actionsflow](https://github.com/actionsflow/actionsflow)

# Docs Contributions

> I appreciate that you want to contribute to the docs, I have to say that I'm not a native English speaker, so maybe there are some grammar errors on the docs, I really appreciate it if you can improve this document.

When working on the Actionsflow documentation, you can choose between two major styles of working:

- Work directly in the [GitHub UI](https://github.com/actionsflow/actionsflow/tree/master/docs), using the “Edit this File” and commit capabilities without having to clone the repository. This is useful for quick documentation updates, typo fixes, and lightweight Markdown changes.
- Clone the [Actionsflow](https://github.com/actionsflow/actionsflow) repo.

Some tips:

- if you need use link the internal docs at Actionsflow, you should always use `/docs/about.md` format to link the other doc, then the doc site will be built as expected
- we use [remark lint](https://github.com/remarkjs/remark-lint) as our markdown document lint, the config is [here](https://github.com/actionsflow/actionsflow/blob/master/.remarkrc.js), run `npm run lint` will checking the document format.

# Code Contributions

Actionsflow is developed by [Typescript](https://www.typescriptlang.org/), so you should use [Typescript](https://www.typescriptlang.org/) to contribute codes.

## Directory Structure

Actionsflow is split up in different modules which are all in a single mono repository.

The most important directories:

- `/packages` - The different Actionsflow modules
- `/packages/actionsflow` - Core code which build workflows and handles workflow execution, active webhook
- `/packages/actionsflow-cli` - CLI code to run Actionsflow
- `/packages/actionsflow-action` - Github actions for Actionsflow
- `/packages/actionsflow-interface` - Common interfaces
- `/examples` - workflows examples
- `/examples/actionsflow-workflow-example` - example workflow
- `/examples/actionsflow-trigger-example` = example trigger

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

1. start and watch codes changes:

   ```bash
   npm run start
   ```

### Test

```bash
npm run test

```

# Run example workflows

build all `examples/actionsflow-workflow-example` workflows:

> You should create `.env` file at the example directory with follow content:
> `JSON_SECRETS='{"IFTTT_KEY":"place your ifttt webhook key","TELEGRAM_BOT_TOKEN":"place your telegram bot token"}'`

```bash
npm run build:example
```

or you can build specific workflow file:

```bash
npm run build:example -- -- -w ./workflows/rss.yml
```

run `act` for run workflows local, you should install [act](https://github.com/nektos/act) first.

```bash
npm run act:example
```

clean build files:

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
1.  Commit code and create pull request(you can use `npm run cm` to commit)

## Create Trigger

It is very easy to create a trigger or Actionsflow.

1. Create a new file for the new trigger. See the [example trigger code](https://github.com/actionsflow/actionsflow/blob/master/examples/triggers/example.ts), you can also see the other [real triggers](https://github.com/actionsflow/actionsflow/tree/master/packages/actionsflow/src/triggers)
1. Add an example YAML workflow file at `/examples/workflows`
1. Add a test for this trigger at `/packages/actionsflow/src/triggers/__tests__`
1. Add a document for this trigger at `/docs/triggers`
