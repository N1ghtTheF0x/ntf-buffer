import { ISerializable } from "./serialize"
import { Struct, StructWriterDefinition } from "./struct"
import { BinaryNumberMap, BinaryNumberType, double, float, half, s16, s32, s64, s8, u16, u32, u64, u8 } from "./types"

/**
 * Interface for writing binary data
 */
export interface IWriter
{
    /**
     * the current write position
     */
    writeOffset: number
    /**
     * Can we write?
     */
    readonly writable: boolean
    /**
     * Write a signed byte
     * @param value A signed byte that gets clamped
     * @returns this 👇
     */
    writeSignedByte(value: s8): this
    /**
     * Write a unsigned byte
     * @param value A unsigned byte that gets clamped
     * @returns this 👇
     */
    writeUnsignedByte(value: u8): this
    /**
     * Write a signed short
     * @param value A signed short that gets clamped
     * @returns this 👇
     */
    writeSignedShort(value: s16): this
    /**
     * Write a unsigned short
     * @param value A unsigned short that gets clamped
     * @returns this 👇
     */
    writeUnsignedShort(value: u16): this
    /**
     * Write a signed integer
     * @param value A signed integer that gets clamped
     * @returns this 👇
     */
    writeSignedInteger(value: s32): this
    /**
     * Write a unsigned integer
     * @param value A unsigned integer that gets clamped
     * @returns this 👇
     */
    writeUnsignedInteger(value: u32): this
    /**
     * Write a signed long
     * @param value A signed long that gets clamped
     * @returns this 👇
     */
    writeSignedLong(value: s64): this
    /**
     * Write a unsigned long
     * @param value A unsigned long that gets clamped
     * @returns this 👇
     */
    writeUnsignedLong(value: u64): this
    /**
     * Write a IEE 754 float16
     * @param value A IEE 754 float16 that gets clamped
     * @returns this 👇
     */
    writeHalf(value: half): this
    /**
     * Write a IEE 754 float32
     * @param value A IEE 754 float32 that gets clamped
     * @returns this 👇
     */
    writeFloat(value: float): this
    /**
     * Write a IEE 754 float64
     * @param value A IEE 754 float64 that gets clamped
     * @returns this 👇
     */
    writeDouble(value: double): this
    /**
     * write a arbitrary array buffer to this buffer
     * @param buffer the array buffer to use
     * @returns this 👇
     */
    writeBuffer(buffer: ArrayBufferLike): this
    /**
     * write an array `arr` as `type` to this buffer
     * @param type the type of arry
     * @param arr the array itself
     * @returns this 👇
     */
    writeArray<T extends BinaryNumberType>(type: T,arr: Array<BinaryNumberMap[T]>): this
    /**
     * write `char` into the buffer
     * @param char the character to write
     * @returns this 👇
     */
    writeChar(char: string): this
    /**
     * write an ascii text `text` into the buffer
     * @param text the text in ascii (will convert it into ascii, so UTF-8 shit gets removed)
     * @returns this 👇
     */
    writeASCII(text: string): this
    /**
     * write a struct from the provided definition
     * @param def The structure of the struct
     * @param value the struct
     * @returns this 👇
     */
    writeStruct<Def extends StructWriterDefinition>(def: Def,value: Struct<Def>): this
    /**
     * fancy method to write data with paramters instead of method chaining
     * @param type the type of the value
     * @param value the value
     * @returns this 👇
     */
    write<T extends BinaryNumberType>(type: T,value: BinaryNumberMap[T]): this
    /**
     * Serialize `object` and write to the buffer. The object needs to implement {@link ISerializable}
     * @param object The object to serialize
     * @returns this 👇
     */
    writeObject<O extends ISerializable>(object: O): this
}