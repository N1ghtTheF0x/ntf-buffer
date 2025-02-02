import { Buffer } from "./dist/index.cjs"

const a = Buffer.create(10)
.writeUnsignedLong(200000000000000n)
.writeUnsignedShort(10000)
const b = a.readStruct({
    a: (buffer) => buffer.readUnsignedLong().toString()
})