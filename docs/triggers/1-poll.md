---
title: "Poll"
metaTitle: "Actionsflow Poll trigger"
metaDescription: "Poll trigger is triggered when new items of a rest API are detected."
---

# Events

## New item in JSON API

```yaml
on:
  poll:
    url: https://jsonplaceholder.typicode.com/posts
    deduplication_key: id
```

### Params

This trigger accepts [all trigger's general params](https://actionsflow.github.io/docs/triggers/#general-params-for-triggers).

- `url`, required, the polling API URL, for example, `https://jsonplaceholder.typicode.com/posts`

- `items_path`, optional, if the API's returned JSON is not a list and is instead an object (maybe paginated), you should configure `items_path` as the key that contains the results. Example: `results`, `items`, `data.items`, etc... The default value is `undefined`, which means the API's response should be a list.

- `deduplication_key`, optional. The poll trigger deduplicates the array we see each poll against the id key. If the id key does not exist, you should specify an alternative unique key to deduplicate. If neither are supplied, we fallback to looking for `guid`, `key`, if neither are supplied, we will hash the item, and generate a unique key

- `requestParams`, optional, we use [Axios](https://github.com/axios/axios) for polling data, so your can pass all params that [axios supported](https://github.com/axios/axios#request-config). For example:

  ```yaml
  on:
    poll:
      url: https://jsonplaceholder.typicode.com/posts
      requestParams:
        method: POST
        headers:
          Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l
  ```

### Outputs

Poll trigger's outputs will be the item of the API results, and `raw__body` for the whole raw body

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
  poll:
    url: https://jsonplaceholder.typicode.com/posts
    max_items_count: 5
jobs:
  print:
    name: Print
    runs-on: ubuntu-latest
    steps:
      - name: Print Outputs
        env:
          title: ${{ on.poll.outputs.title }}
          body: ${{ on.poll.outputs.body }}
        run: |
          echo "title: $title"
          echo "body: $body"
```
