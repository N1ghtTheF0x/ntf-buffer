import { Buffer } from "./source/buffer"

const a = Buffer.create(10)
a.writeSignedLong(20000000000000n).writeSignedShort(4124)
console.dir(a.buffer)