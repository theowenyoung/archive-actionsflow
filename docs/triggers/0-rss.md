---
title: "RSS"
metaTitle: "Actionsflow RSS trigger"
metaDescription: "RSS trigger is triggered when new items are detected. This trigger supports one or multiple RSS sources"
---

RSS trigger is triggered when new items are detected. This trigger supports one(`event: new_item`) or multiple RSS sources((`event: new_item_in_multiple_feeds`)).

# Events

## New item in a feed

```yaml
on:
  rss:
    event: new_item
    url: https://hnrss.org/newest?points=300
```

Event `new_item` watched a single feed URL.

### Params

- `event`, optional, the value must be `new_item`, the default value is `new_item`, so you can ignore it also.
- `url`, required, the RSS feed URL, for example, <https://hnrss.org/newest?points=300> items

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
on:
  rss:
    url: https://hnrss.org/newest?points=300
jobs:
  print:
    name: Print
    runs-on: ubuntu-latest
    steps:
      - name: Print Outputs
        env:
          title: ${{on.rss.outputs.title}}
          contentSnippet: ${{on.rss.outputs.contentSnippet}}
          link: ${{on.rss.outputs.link}}
        run: |
          echo title: $title
          echo contentSnippet: $contentSnippet
          echo link: $link
```

### New item in multiple feeds

```yaml
on:
  rss:
    event: new_item_in_multiple_feeds
    urls:
      - https://hnrss.org/newest?points=300
      - https://www.buzzfeed.com/world.xml
    max_items_count: 15
```

Event `new_item_in_multiple_feeds` can watch multiple feeds, any of these feeds' updates will be triggered.

### Params

- `event`, required, the value must be `new_item_in_multiple_feeds`
- `urls`, required, a URL array, the RSS feed URLs
- `every`, optional, RSS fetch interval, the unit is minute, the default value is `5`
- `skip_first`, optional, if RSS fetch should skip the first items, the default value is `false`
- `max_items_count`, optional, the feed items max length, the default value is `undefined`, it will trigger all feed items

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
on:
  rss:
    event: new_item_in_multiple_feeds
    urls:
      - https://hnrss.org/newest?points=300
      - https://www.buzzfeed.com/world.xml
    max_items_count: 15
jobs:
  print:
    name: Print
    runs-on: ubuntu-latest
    steps:
      - name: Print Outputs
        env:
          title: ${{on.rss.outputs.title}}
          contentSnippet: ${{on.rss.outputs.contentSnippet}}
          link: ${{on.rss.outputs.link}}
        run: |
          echo title: $title
          echo contentSnippet: $contentSnippet
          echo link: $link
```
