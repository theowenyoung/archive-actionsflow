---
title: "Script"
metaTitle: "Actionsflow Script trigger"
metaDescription: "Script trigger is triggered when call a custom script function returns."
---

You can use script trigger simply to write a script for a custom trigger logic.

# Events

## New item when run javascript function script

```yaml
on:
  script:
    run: |
      const result = await axios.get("https://jsonplaceholder.typicode.com/posts")
      return {
        items: result.data
      }
    deduplication_key: id
```

Or, you can use a `path` to run the external script. For example,

```yaml
on:
  script:
    path: ./script.js
```

> `script.js` should be placed in the same directory with the workflow file. You can also place it in the other folder if you prefer, use a relative path to refer it.

### Params

This trigger accepts [all trigger's general params](https://actionsflow.github.io/docs/triggers/#general-params-for-triggers).

- `run`, optional, the script code, you should use javascript language for the script.

- `path`, optional,

- `deduplication_key`, optional. The script trigger deduplicates the array we see each script against the id key. If the id key does not exist, you should specify an alternative unique key to deduplicate off of. If neither are supplied, we fallback to looking for `guid`, `key`, if neither are supplied, we will hash the item, and generate a unique key

  ```yaml
  on:
    script:
      url: https://jsonplaceholder.typicode.com/posts
      requestParams:
        method: POST
        headers:
          Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l
  ```

### Context

You can use the following context at your script code:

- `axios`, [A promise based HTTP client for node.js](https://github.com/axios/axios), you can use it for HTTP request.
- `github`,

### Outputs

Script trigger's outputs will be the item of the API results, and `raw__body` for the whole raw body

An outputs example:

```json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
  "raw__body": [
    {
      "userId": 1,
      "id": 1,
      "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
    },
    {
      "userId": 1,
      "id": 2,
      "title": "qui est esse",
      "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
    }
  ]
}
```

You can use the outputs like this:

```yaml
on:
  script:
    url: https://jsonplaceholder.typicode.com/posts
    max_items_count: 5
jobs:
  print:
    name: Print
    runs-on: ubuntu-latest
    steps:
      - name: Print Outputs
        env:
          title: ${{ on.script.outputs.title }}
          body: ${{ on.script.outputs.body }}
        run: |
          echo "title: $title"
          echo "body: $body"
```
