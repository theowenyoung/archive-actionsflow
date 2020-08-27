---
title: "RSS"
metaTitle: "Actionsflow RSS trigger"
metaDescription: "RSS trigger is triggered when new items are detected. This trigger supports one or multiple RSS sources"
---

RSS trigger is triggered when new items are detected. This trigger supports one(`event: new_item`) or multiple RSS sources((`event: new_item_in_multiple_feeds`)).

# Events

## New item in feed

```yaml
on:
  rss:
    event: new_item
    URL: https://hnrss.org/newest?points=300
```

Event `new_item` watched a single feed URL.

### Params

- `event`, optional, the value must be `new_item`, default value is `new_item`, so you can ignore it also.
- `url`, required, the RSS feed URL, for example: <https://hnrss.org/newest?points=300> items

### Outputs

Actionsflow use [rss-parser](https://github.com/rbren/rss-parser) for parse RSS file, the outputs are same as [rss-parser](https://github.com/rbren/rss-parser)

An outputs example:

```json
{
  "title": "The water is too deep, so he improvises",
  "link": "https://www.reddit.com/r/funny/comments/3skxqc/the_water_is_too_deep_so_he_improvises/",
  "pubDate": "Thu, 12 Nov 2015 21:16:39 +0000",
  "content": "<table> <tr><td> <a href=\"https://www.reddit.com/r/funny/comments/3skxqc/the_water_is_too_deep_so_he_improvises/\"><img src=\"https://b.thumbs.redditmedia.com/z4zzFBqZ54WT-rFfKXVor4EraZtJVw7AodDvOZ7kitQ.jpg\" alt=\"The water is too deep, so he improvises\" title=\"The water is too deep, so he improvises\" /></a> </td><td> submitted by <a href=\"https://www.reddit.com/user/cakebeerandmorebeer\"> cakebeerandmorebeer </a> to <a href=\"https://www.reddit.com/r/funny/\"> funny</a> <br/> <a href=\"http://i.imgur.com/U407R75.gifv\">[link]</a> <a href=\"https://www.reddit.com/r/funny/comments/3skxqc/the_water_is_too_deep_so_he_improvises/\">[275 comments]</a> </td></tr></table>",
  "contentSnippet": "submitted by  cakebeerandmorebeer  to  funny \n [link] [275 comments]",
  "guid": "https://www.reddit.com/r/funny/comments/3skxqc/the_water_is_too_deep_so_he_improvises/",
  "categories": ["funny"],
  "isoDate": "2015-11-12T21:16:39.000Z"
}
```

You can use the outputs like this:

```yaml
jobs:
  ifttt:
    name: Make a Request to IFTTT
    runs-on: ubuntu-latest
    steps:
      - uses: actionsflow/ifttt-webhook-action@v1
        with:
          event: notice
          key: ${{ secrets.IFTTT_KEY }}
          value1: ${{ on.rss.outputs.title }}
          value2: ${{ on.rss.outputs.contentSnippet }}
          value3: ${{ on.rss.outputs.link }}
```

### New item in multiple feeds

```yaml
on:
  rss:
    event: new_item_in_multiple_feeds
    URLs:
      - https://hnrss.org/newest?points=300
      - https://www.buzzfeed.com/world.xml
    max_items_count: 15
```

Event `new_item_in_multiple_feeds` can watch multiple feeds, any of these feeds' updates will be triggered.

### Params

- `event`, required, the value must be `new_item_in_multiple_feeds`
- `URLs`, required, a URL array, the RSS feed URLs
- `every`, optional, RSS fetch interval, the unit is minute, default value is `5`
- `skip_first`, optional, if RSS fetch should skip the first items, default value is `false`
- `max_items_count`, optional, the feed items max length, default value is `undefined`, it will trigger all feed items

### Outputs

Actionsflow use [rss-parser](https://github.com/rbren/rss-parser) for parse RSS file, the outputs are same as [rss-parser](https://github.com/rbren/rss-parser)

An outputs example:

```json
{
  "title": "The water is too deep, so he improvises",
  "link": "https://www.reddit.com/r/funny/comments/3skxqc/the_water_is_too_deep_so_he_improvises/",
  "pubDate": "Thu, 12 Nov 2015 21:16:39 +0000",
  "content": "<table> <tr><td> <a href=\"https://www.reddit.com/r/funny/comments/3skxqc/the_water_is_too_deep_so_he_improvises/\"><img src=\"https://b.thumbs.redditmedia.com/z4zzFBqZ54WT-rFfKXVor4EraZtJVw7AodDvOZ7kitQ.jpg\" alt=\"The water is too deep, so he improvises\" title=\"The water is too deep, so he improvises\" /></a> </td><td> submitted by <a href=\"https://www.reddit.com/user/cakebeerandmorebeer\"> cakebeerandmorebeer </a> to <a href=\"https://www.reddit.com/r/funny/\"> funny</a> <br/> <a href=\"http://i.imgur.com/U407R75.gifv\">[link]</a> <a href=\"https://www.reddit.com/r/funny/comments/3skxqc/the_water_is_too_deep_so_he_improvises/\">[275 comments]</a> </td></tr></table>",
  "contentSnippet": "submitted by  cakebeerandmorebeer  to  funny \n [link] [275 comments]",
  "guid": "https://www.reddit.com/r/funny/comments/3skxqc/the_water_is_too_deep_so_he_improvises/",
  "categories": ["funny"],
  "isoDate": "2015-11-12T21:16:39.000Z"
}
```

You can use the outputs like this:

```yaml
jobs:
  ifttt:
    name: Make a Request to IFTTT
    runs-on: ubuntu-latest
    steps:
      - uses: actionsflow/ifttt-webhook-action@v1
        with:
          event: notice
          key: ${{ secrets.IFTTT_KEY }}
          value1: ${{ on.rss.outputs.title }}
          value2: ${{ on.rss.outputs.contentSnippet }}
          value3: ${{ on.rss.outputs.link }}
```