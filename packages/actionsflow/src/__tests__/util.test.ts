import { template } from "../util";

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

test("template function string", () => {
  expect(
    template("test ${{ toJson(on.test.json) }}", {
      on: {
        test: {
          json: {
            key: "value",
          },
        },
      },
    })
  ).toBe('test {\n  "key": "value"\n}');
});
