---
title: "Telegram Bot"
metaTitle: "Telegram Bot trigger"
---

Telegram Bot trigger is triggered when new messages of telegram bot are detected. This trigger supports to specify one message type or multiple message types

# Events

## New message in telegram bot

```yaml
# single message type
on:
  telegram_bot:
    events:
      - photo
      - text
    token: ${{ secrets.TELEGRAM_BOT_TOKEN }}
# multiple message types
on:
  telegram_bot:
    event: text
    token: ${{ secrets.TELEGRAM_BOT_TOKEN }}
```

### Params

- `token`, required, telegram bot token, you should get it from [Telegram BotFather](https://telegram.me/BotFather), for example: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`
- `event`, optional, telegram message type, allowed types: `text`,`animation`,`audio`,`channel_chat_created`,`contact`,`delete_chat_photo`,`dice`,`document`,`game`,`group_chat_created`,`invoice`,`left_chat_member`,`location`,`migrate_from_chat_id`,`migrate_to_chat_id`,`new_chat_members`,`new_chat_photo`,`new_chat_title`,`passport_data`,`photo`,`pinned_message`,`poll`,`sticker`,`successful_payment`,`supergroup_chat_created`,`video`,`video_note`,`voice`, if neither `event` or `events` is not provided, all message will be triggered.
- `events`, optional, an array of event, example: `["text","photo"]`
- `every`, optional, RSS fetch interval, the unit is minute, default value is `5`
- `skip_first`, optional, if RSS fetch should skip the first items, default value is `false`
- `max_items_count`, optional, the feed items max length, default value is `undefined`, it will trigger all feed items

## Outputs

This trigger's outputs will be the item of the telegram message, you can see it [here](https://core.telegram.org/bots/api#message)

An outputs example:

```json
{
  "message_id": 7,
  "from": {
    "id": 1056059698,
    "is_bot": false,
    "first_name": "Owen",
    "last_name": "Young",
    "language_code": "en"
  },
  "chat": {
    "id": 1056059698,
    "first_name": "Owen",
    "last_name": "Young",
    "type": "private"
  },
  "date": 1598383043,
  "text": "test",
  "update_id": 791185172
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
          event: test
          key: ${{ secrets.IFTTT_KEY }}
          value1: ${{ on.telegram_bot.outputs.text }}
          value2: ${{ toJson(on.telegram_bot.outputs) }}
```
