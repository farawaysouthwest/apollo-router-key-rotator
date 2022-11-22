import {randomBytes} from "crypto";

export function generateKey(size = 32, format: BufferEncoding = "base64") {
  const buffer = randomBytes(size);
  return buffer.toString(format);
}
