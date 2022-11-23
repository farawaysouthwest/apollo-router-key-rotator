import {randomBytes} from "crypto";

export function generateKey(size = 32) {
  const buffer = randomBytes(size);
  return buffer.toString("hex");
}
