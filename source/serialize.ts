import type { Buffer } from "./buffer"

export const SERIALIZE_SYMBOL = Symbol("ntf-buffer-serialize")
export const DESERIALSIZE_SYMBOL = Symbol("ntf-buffer-deserialize")

export interface ISerializable
{
    [SERIALIZE_SYMBOL](): Buffer
    [DESERIALSIZE_SYMBOL](buffer: Buffer): this
}