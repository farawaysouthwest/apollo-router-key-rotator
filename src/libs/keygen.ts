import {randomBytes} from "crypto";

export function generateKey(size: number = 32, format: BufferEncoding = "hex") {
  const buffer = randomBytes(size);
  return buffer.toString(format);
}
