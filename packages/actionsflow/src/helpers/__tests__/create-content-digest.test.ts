import { createContentDigest } from "../create-content-digest";

test("check createContentDigest hash", () => {
  expect(
    createContentDigest({
      test: 1,
    })
  ).toBe("3f5cf25ee3f69ec1ec1b6d97b6c15241");
});
