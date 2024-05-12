// I know that this doesn't make a difference because TypeScript converts them to the 'number' or 'bigint' type but idgaf
/**
 * Signed Byte
 */
export type s8 = Int8Array[0]
/**
 * Unsigned Byte
 */
export type u8 = Uint8Array[0] | Uint8ClampedArray[0]
/**
 * Signed Short
 */
export type s16 = Int16Array[0]
/**
 * Unsigned Short
 */
export type u16 = Uint16Array[0]
/**
 * Signed Integer
 */
export type s32 = Int32Array[0]
/**
 * Unsigned Integer
 */
export type u32 = Uint32Array[0]
/**
 * Signed Long
 */
export type s64 = BigInt64Array[0]
/**
 * Unsigned Long
 */
export type u64 = BigUint64Array[0]
/**
 * IEEE 754 Single precision
 */
export type float = Float32Array[0]
/**
 * IEEE 754 Double precision
 */
export type double = Float64Array[0]
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
export type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | BigInt64Array | BigUint64Array | Float32Array | Float64Array
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
    "float": Float32Array
    "double": Float64Array
}