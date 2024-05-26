import { Buffer } from "./source/buffer"
import { MAX_U64 } from "./source/limits"
import { clamp } from "./source/utils"

const a = Buffer.create(10)
.writeUnsignedLong(200000000000000n)
.writeUnsignedShort(10000)
const b = a.readStruct({
    a: (buffer) => buffer.readUnsignedLong().toString()
})
