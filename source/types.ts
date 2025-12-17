// I know that this doesn't make a difference because TypeScript converts them to the 'number' or 'bigint' type but idgaf

import { MAX_S24, MAX_U24, MIN_S24 } from "./limits"
import { clamp } from "./utils"

/**
 * Represents any kind of number that is available in JavaScript
 */
export type AnyNumber = number | bigint

/**
 * "Converts" an typed array to big endian, aka reverse
 * @param array A typed array
 */
export const bigEndian = <T extends TypedArray>(array: T) => array.reverse() as T

/**
 * Signed Byte
 */
export type s8 = Int8Array[0]

export function s8(v: AnyNumber): ArrayBuffer
{
    return new Int8Array([Number(v)]).buffer
}
/**
 * Unsigned Byte
 */
export type u8 = Uint8Array[0] | Uint8ClampedArray[0]

export function u8(v: AnyNumber,clamped = false): ArrayBuffer
{
    // bro this works??
    return new (clamped ? Uint8ClampedArray : Uint8Array)([Number(v)]).buffer
}
/**
 * Signed Short
 */
export type s16 = Int16Array[0]

export function s16(v: AnyNumber): ArrayBuffer
{
    return new Int16Array([Number(v)]).buffer
}
/**
 * Unsigned Short
 */
export type u16 = Uint16Array[0]

export function u16(v: AnyNumber): ArrayBuffer
{
    return new Uint16Array([Number(v)]).buffer
}

/**
 * Signed 24-bit number
 */
export type s24 = number

export function s24(v: AnyNumber): ArrayBuffer
{
    return s32(clamp(Number(v),MIN_S24,MAX_S24)).slice(0,3)
}

/**
 * Unsigned 24-bit number
 */
export type u24 = number

export function u24(v: AnyNumber): ArrayBuffer
{
    return u32(clamp(Number(v),0,MAX_U24)).slice(0,3)
}
/**
 * Signed Integer
 */
export type s32 = Int32Array[0]

export function s32(v: AnyNumber): ArrayBuffer
{
    return new Int32Array([Number(v)]).buffer
}
/**
 * Unsigned Integer
 */
export type u32 = Uint32Array[0]

export function u32(v: AnyNumber): ArrayBuffer
{
    return new Uint32Array([Number(v)]).buffer
}
/**
 * Signed Long
 */
export type s64 = BigInt64Array[0]

export function s64(v: AnyNumber): ArrayBuffer
{
    return new BigInt64Array([BigInt(v)]).buffer
}
/**
 * Unsigned Long
 */
export type u64 = BigUint64Array[0]

export function u64(v: AnyNumber): ArrayBuffer
{
    return new BigUint64Array([BigInt(v)]).buffer
}

/**
 * IEEE 754 Half precision (16-bit)
 */
export type half = Float16Array[0]

export function half(v: AnyNumber): ArrayBuffer
{
    return new Float16Array([Number(v)]).buffer
}
/**
 * IEEE 754 Single precision (32-bit)
 */
export type float = Float32Array[0]

export function float(v: AnyNumber): ArrayBuffer
{
    return new Float32Array([Number(v)]).buffer
}
/**
 * IEEE 754 Double precision (64-bit)
 */
export type double = Float64Array[0]

export function double(v: AnyNumber): ArrayBuffer
{
    return new Float64Array([Number(v)]).buffer
}
/**
 * The byte order of any binary data
 */
export type Endianness = "little" | "big"

/**
 * Check if `value` is a endianness type
 * @param value A value
 */
export function isEndianness(value: unknown): value is Endianness
{
    return typeof value == "string" && ["little","big"].includes(value)
}

/**
 * A typed map for resolving to a binary type
 */
export type BinaryNumberMap = {
    "s8": s8
    "u8": u8
    "s16": s16
    "u16": u16
    "s24": s24
    "u24": u24
    "s32": s32
    "u32": u32
    "s64": s64
    "u64": u64
    "half": half
    "float": float
    "double": double
}
/**
 * The type of a binary number as a string
 */
export type BinaryNumberType = keyof BinaryNumberMap
/**
 * All typed arrays as one type
 */
export type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | BigInt64Array | BigUint64Array | Float16Array | Float32Array | Float64Array
/**
 * A typed map for resolving to a typed array
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

/**
 * Represents a object that has a `arrayBuffer` method which returns `Promise<ArrayBuffer>`. Objects such as `Blob` and `Response` fall under this category
 */
export interface IAsyncArrayBuffer
{
    /**
     * Get the array buffer of this object
     */
    arrayBuffer(): Promise<ArrayBuffer>
}

/**
 * Check if `value` is a object with a asyncronized array buffer method
 * @param value A value
 */
export function isAsyncArrayBuffer(value: unknown): value is IAsyncArrayBuffer
{
    return value !== null && typeof value == "object" &&
            "arrayBuffer" in value && typeof value.arrayBuffer == "function"
}

/**
 * A object that represents a slice of binary data
 */
export interface IArrayBufferView
{
    /**
     * The array buffer
     */
    readonly buffer: ArrayBufferLike
    /**
     * The start of the array buffer
     */
    readonly byteOffset: number
    /**
     * The length of the viewable array buffer in bytes
     */
    readonly byteLength: number
}

/**
 * Check if `value` is a array buffer view
 * @param value A value
 * @param checkES2024 Include functionality introduced in ES2024
 */
export function isArrayBufferView(value: unknown,checkES2024?: boolean): value is IArrayBufferView
{
    return value !== null && typeof value == "object" &&
            "buffer" in value && isAnyArrayBuffer(value.buffer,checkES2024) &&
            "byteOffset" in value && typeof value.byteOffset == "number" &&
            "byteLength" in value && typeof value.byteLength == "number"
}

/**
 * Check if `value` represent the binary `type`
 * @param value A value
 * @param type Type of binary
 */
export function isBinaryNumber<T extends keyof BinaryNumberMap>(value: unknown,type: T): value is BinaryNumberMap[T]
{
    return (
        typeof value == "number" && [
            "s8","u8",
            "s16","u16",
            "s32","u32",
            "half","float","double"
        ].includes(type)
    ) || (
        typeof value == "bigint" && [
            "s64","u64"
        ].includes(type)
    )
}

/**
 * Ensure that `value` matches the binary `type`
 * @param value A value
 * @param type Type of binary
 * @throws Value does not represent binary type
 */
export function ensureBinaryNumber<T extends keyof BinaryNumberMap>(value: unknown,type: T): BinaryNumberMap[T]
{
    if(isBinaryNumber(value,type))
        return value
    throw new Error(`'${value}' does not represent '${type}'`)
}

/**
 * Check if `value` is an array buffer
 * @param value A value
 * @param checkES2024 Include functionality introduced in ES2024
 */
export function isArrayBuffer(value: unknown,checkES2024: boolean = false): value is ArrayBuffer
{
    if(value === null || typeof value != "object")
        return false
    const es5 = "byteLength" in value && typeof value.byteLength == "number" &&
                "slice" in value && typeof value.slice == "function"
    const es2024 = "maxByteLength" in value && typeof value.maxByteLength == "number" &&
                   "resizable" in value && typeof value.resizable == "boolean" &&
                   "resize" in value && typeof value.resize == "function" &&
                   "detached" in value && typeof value.detached == "boolean" &&
                   "transfer" in value && typeof value.transfer == "function" &&
                   "transferToFixedLength" in value && typeof value.transferToFixedLength == "function"
    return checkES2024 ? es5 && es2024 : es5
}

/**
 * Check if `value` is an shared array buffer
 * @param value A value
 * @param checkES2024 Include functionality introduced in ES2024
 */
export function isSharedArrayBuffer(value: unknown,checkES2024: boolean = false): value is SharedArrayBuffer
{
    if(value === null || typeof value != "object")
        return false
    const es2017 = "byteLength" in value && typeof value.byteLength == "number" &&
                   "slice" in value && typeof value.slice == "function"
    const es2024 = "growable" in value && typeof value.growable == "boolean" &&
                   "maxByteLength" in value && typeof value.maxByteLength == "number" &&
                   "grow" in value && typeof value.grow == "function"
    return checkES2024 ? es2017 && es2024 : es2017
}

/**
 * Check if `value` is a array buffer or shared array buffer
 * @param value A value
 * @param checkES2024 Include functionality introduced in ES2024
 */
export function isAnyArrayBuffer(value: unknown,checkES2024?: boolean): value is ArrayBufferLike
{
    return isArrayBuffer(value,checkES2024) || isSharedArrayBuffer(value,checkES2024)
}

/**
 * A value that represents some kind of binary data
 */
export type BinaryDataLike = IArrayBufferView | ArrayBufferLike

/**
 * Resolve `value` to any kind of array buffer
 * @param value A value that represents some kind of binary data
 */
export function resolveBinaryDataLike(value: BinaryDataLike): ArrayBufferLike
{
    if(isArrayBufferView(value))
        return value.buffer.slice(value.byteOffset,value.byteOffset + value.byteLength)
    if(isAnyArrayBuffer(value))
        return value
    throw new TypeError(`'${value}' is not binary data`)
}