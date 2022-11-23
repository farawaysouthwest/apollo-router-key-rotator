import {assert} from "chai";
import {describe, it} from "mocha";
import {generateKey} from "../../libs/keygen";

describe("Keygen Utils", () => {
  it("test generateKey", () => {
    const key = generateKey();

    assert.isTrue(typeof key === "string");
    assert.equal(key.length, 64);
  });

  it("test generateKey with custom key length", () => {
    const key = generateKey(16);

    assert.isTrue(typeof key === "string");
    assert.equal(key.length, 32);
  });
});
