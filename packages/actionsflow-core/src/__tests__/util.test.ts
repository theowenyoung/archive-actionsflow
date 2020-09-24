import {
  template,
  getTemplateStringByParentName,
  getExpressionResult,
  isPromise,
  getRawTriggers,
  filter,
} from "../utils";
import emails from "./fixtures/emails.json";
test("filter", () => {
  const items = emails;
  const filterResults = filter(items, {
    "from.value": {
      $elemMatch: {
        address: "test3@gmail.com",
      },
    },
    subject: {
      $regex: "hash2",
    },
  });
  expect(filterResults.all().length).toBe(1);
});
test("filter outputs", () => {
  const items = emails;
  const filterResults = filter(
    items,
    {
      "from.value": {
        $elemMatch: {
          address: "test3@gmail.com",
        },
      },
      subject: {
        $regex: "hash2",
      },
    },
    {
      subject: {
        $substrBytes: ["$subject", 0, 7],
      },
    }
  );
  expect(filterResults.all().length).toBe(1);
  expect(JSON.stringify(filterResults.all())).toBe('[{"subject":"[hash2]"}]');
});

test("isPromise yes", () => {
  const is = isPromise(
    new Promise((resolve) => {
      return resolve(1);
    })
  );
  expect(is).toBe(true);
});

test("isPromisee no", () => {
  const is = isPromise({ test: 1 });
  expect(is).toBe(false);
});
test("getExpressionResult", () => {
  expect(
    getExpressionResult("data.test", { data: { test: "testvalue" } })
  ).toBe("testvalue");
});
test("getTemplateStringByParentName simple", () => {
  expect(
    getTemplateStringByParentName(
      "test ${{on.test.event}} true ${{github.event_type}}",
      "on",
      {
        on: {
          test: `(fromJson(env.test))`,
        },
      }
    )
  ).toBe("test ${{(fromJson(env.test)).event}} true ${{github.event_type}}");
});

test("getTemplateStringByParentName simple2", () => {
  expect(
    getTemplateStringByParentName(
      "$xxx test ${{ true && on.test.event && true}} 999 ${{ true && on.test.event && true}} true ${{github.event_type}} false$",
      "on",
      {
        on: {
          test: `(fromJson(env.test))`,
        },
      }
    )
  ).toBe(
    "$xxx test ${{ true && (fromJson(env.test)).event && true}} 999 ${{ true && (fromJson(env.test)).event && true}} true ${{github.event_type}} false$"
  );
});

test("getTemplateStringByParentName simple3", () => {
  expect(
    getTemplateStringByParentName(
      "$xxx test ${{ true && on['test'].event && true}} 999 ${{ true && on.test.event && true}} true ${{github.event_type}} false$",
      "on",
      {
        on: {
          test: `(fromJson(env.test))`,
        },
      }
    )
  ).toBe(
    "$xxx test ${{ true && (fromJson(env.test)).event && true}} 999 ${{ true && (fromJson(env.test)).event && true}} true ${{github.event_type}} false$"
  );
});

test("template string", () => {
  expect(
    template("test ${{on.test.event}}", {
      on: {
        test: {
          event: "new_item",
        },
      },
    })
  ).toBe("test new_item");
});

test("template string 2", () => {
  expect(
    template("test ${{ true && on.test.event}}", {
      on: {
        test: {
          event: "new_item",
        },
      },
    })
  ).toBe("test new_item");
});

test("template if condition string", () => {
  expect(
    template(
      "${{on.test.outcome ===  'success'}}",
      {
        on: {
          test: {
            outcome: "success",
          },
        },
      },
      {}
    )
  ).toBe("true");
});

test("get raw trigger", () => {
  expect(
    getRawTriggers({
      on: {
        rss: {
          url: "test",
        },
        poll: {
          url: "test2",
        },
      },
    })
  ).toEqual([
    {
      name: "rss",
      options: { url: "test" },
    },
    {
      name: "poll",
      options: { url: "test2" },
    },
  ]);
});
