import {
  template,
  getTemplateStringByParentName,
  getExpressionResult,
} from "../util";

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
