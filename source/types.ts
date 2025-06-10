// I know that this doesn't make a difference because TypeScript converts them to the 'number' or 'bigint' type but idgaf
/**
 * Signed Byte
 */
export type s8 = Int8Array[0]

export function s8(v: s8): ArrayBuffer
{
    return new Int8Array([v]).buffer
}
/**
 * Unsigned Byte
 */
export type u8 = Uint8Array[0] | Uint8ClampedArray[0]

export function u8(v: u8,clamped = false): ArrayBuffer
{
    // bro this works??
    return new (clamped ? Uint8ClampedArray : Uint8Array)([v]).buffer
}
/**
 * Signed Short
 */
export type s16 = Int16Array[0]

export function s16(v: s16): ArrayBuffer
{
    return new Int16Array([v]).buffer
}
/**
 * Unsigned Short
 */
export type u16 = Uint16Array[0]

export function u16(v: u16): ArrayBuffer
{
    return new Uint16Array([v]).buffer
}
/**
 * Signed Integer
 */
export type s32 = Int32Array[0]

export function s32(v: s32): ArrayBuffer
{
    return new Int32Array([v]).buffer
}
/**
 * Unsigned Integer
 */
export type u32 = Uint32Array[0]

export function u32(v: u32): ArrayBuffer
{
    return new Uint32Array([v]).buffer
}
/**
 * Signed Long
 */
export type s64 = BigInt64Array[0]

export function s64(v: s64): ArrayBuffer
{
    return new BigInt64Array([v]).buffer
}
/**
 * Unsigned Long
 */
export type u64 = BigUint64Array[0]

export function u64(v: u64): ArrayBuffer
{
    return new BigUint64Array([v]).buffer
}

/**
 * IEEE 754 half precision (16-bit)
 */
export type half = Float16Array[0]

export function half(v: half): ArrayBuffer
{
    return new Float16Array([v]).buffer
}
/**
 * IEEE 754 Single precision (32-bit)
 */
export type float = Float32Array[0]

export function float(v: float): ArrayBuffer
{
    return new Float32Array([v]).buffer
}
/**
 * IEEE 754 Double precision (64-bit)
 */
export type double = Float64Array[0]

export function double(v: double): ArrayBuffer
{
    return new Float64Array([v]).buffer
}
/**
 * the byte order of the binary data
 */
export type Endianness = "little" | "big"
/**
 * fancy map for generic shit
 */
export type BinaryNumberMap = {
    "s8": s8
    "u8": u8
    "s16": s16
    "u16": u16
    "s32": s32
    "u32": u32
    "s64": s64
    "u64": u64
    "half": half
    "float": float
    "double": double
}
/**
 * the key names of the fancy map for generic shit
 */
export type BinaryNumberType = keyof BinaryNumberMap
/**
 * I don't know why but there's no built-in type so I had to make one. These are all the Typed Arrays JavaScript has
 */
export type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | BigInt64Array | BigUint64Array | Float16Array | Float32Array | Float64Array
/**
 * another fancy map for something (I think it's unused?)
 */
export type TypedArrayMap = {
    "s8": Int8Array
    "u8": Uint8Array | Uint8ClampedArray
    "s16": Int16Array
    "u16": Uint16Array
    "s32": Int32Array
    "u32": Uint32Array
    "s64": BigInt64Array
    "u64": BigUint64Array
    "half": Float16Array
    "float": Float32Array
    "double": Float64Array
}
export interface IAsyncArrayBuffer
{
    arrayBuffer(): Promise<ArrayBuffer>
}