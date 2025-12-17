import { IBinaryData } from "./binary"
import { toBytes } from "./number"
import { AnyNumber, u16, u8 } from "./types"
import { mergeArraybuffer } from "./utils"

export interface IStringEncoding
{
    decode(data: IBinaryData,length: AnyNumber): string
    encode(string: string): ArrayBufferLike
}

function __string_buffer__(string: string,mapper: (char: string) => ArrayBufferLike): ArrayBufferLike
{
    return mergeArraybuffer(...[...string].map(mapper))
}

export namespace StringEncodings
{
    export const ASCII: IStringEncoding = {
        decode(data,l)
        {
            const length = BigInt(l)
            const chars: Array<number> = []
            for(let i = 0n;i < length;i++)
                chars.push(Math.abs(data.readSignedByte()) & 127)
            return String.fromCharCode(...chars)
        },
        encode(string)
        {
            return __string_buffer__(
                string,
                c => mergeArraybuffer(
                    ...toBytes(c.charCodeAt(0),0xff)
                    .map(d => u8(d & 127))
                )
            )
        }
    }
    export const UTF16: IStringEncoding = {
        decode(data, l)
        {
            const length = BigInt(l)
            const chars: Array<number> = []
            for(let i = 0n;i < length;i++)
                chars.push(data.readUnsignedShort())
            return String.fromCharCode(...chars)
        },
        encode(string)
        {
            return __string_buffer__(
                string,
                c => u16(c.charCodeAt(0))
            )
        },
    }
}