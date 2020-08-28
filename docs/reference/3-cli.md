---
title: Actionsflow CLI API
---

This document is for [npm Actionsflow package](https://www.npmjs.com/package/actionsflow), you can use `actionsflow` by API or CLI.

Here is the Actionsflow CLI API docs, you can see [API docs at here](/docs/reference/2-api.md)

## Install

```bash
# You can use Actionsflow by npx
npx actionsflow build

# or, global install actionsflow
npm i actionsflow -g

# or install Actionsflow to your project
npm i actionsflow --save
```

# Usage

```bash
Usage: actionsflow <command> [options]

Commands:
  actionsflow build  Build a Actionsflow
                     workflows.
  actionsflow clean  Wipe the local actionsflow
                     environment including built
                     assets and cache

Options:
  --verbose      Turn on verbose output
                      [boolean] [default: false]
  -h, --help     Show help             [boolean]
  -v, --version  Show the version of the
                 Actionsflow CLI and the
                 Actionsflow package in the
                 current project       [boolean]
```

# Commands

## build

Build Actionsflow workflow files to standard Github actions workflow files

```bash
actionsflow build

Build a Actionsflow workflows.

Options:
  --verbose      Turn on verbose output
                      [boolean] [default: false]
  --dest         workflows build dest path
                    [string] [default: "./dist"]
  --base         workspace base path
                              [string] [default:
         "/Users/owenyoung/project/actionsflow"]
  --workflows    workflows path
               [string] [default: "./workflows"]
  -h, --help     Show help             [boolean]
  -v, --version  Show the version of the
                 Actionsflow CLI and the
                 Actionsflow package in the
                 current project       [boolean]
```

## clean

Clean the dist folder and cache

```bash
actionsflow clean

Wipe the local actionsflow environment including
built assets and cache

Options:
  --verbose      Turn on verbose output
                      [boolean] [default: false]
  --dest         workflows build dest path
                    [string] [default: "./dist"]
  --base         workspace base path
                              [string] [default:
         "/Users/owenyoung/project/actionsflow"]
  -h, --help     Show help             [boolean]
  -v, --version  Show the version of the
                 Actionsflow CLI and the
                 Actionsflow package in the
                 current project       [boolean]
```
