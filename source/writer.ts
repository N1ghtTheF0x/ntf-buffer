import { IStringEncoding } from "./string"
import { Struct, StructWriterDefinition } from "./struct"
import { BinaryNumberMap, BinaryNumberType, AnyNumber, BinaryDataLike } from "./types"

/**
 * Interface for writing binary data
 */
export interface IWriter
{
    /**
     * The current write position in bytes
     */
    writeOffset: number
    /**
     * Set the write position
     * @param offset A offset in bytes
     */
    setWriteOffset(offset: AnyNumber): this
    /**
     * Is this object still writable?
     */
    readonly writable: boolean
    /**
     * Write a signed byte
     * @param value A signed byte that gets clamped
     */
    writeSignedByte(value: AnyNumber): this
    /**
     * Write a unsigned byte
     * @param value A unsigned byte that gets clamped
     */
    writeUnsignedByte(value: AnyNumber): this
    /**
     * Write a signed short
     * @param value A signed short that gets clamped
     */
    writeSignedShort(value: AnyNumber): this
    /**
     * Write a unsigned short
     * @param value A unsigned short that gets clamped
     */
    writeUnsignedShort(value: AnyNumber): this
    /**
     * Write a signed 24-bit number
     * @param value A signed 24-bit number that gets clamped
     */
    writeSigned24(value: AnyNumber): this
    /**
     * Write a unsigned 24-bit number
     * @param value A unsigned 24-bit number that gets clamped
     */
    writeUnsigned24(value: AnyNumber): this
    /**
     * Write a signed integer
     * @param value A signed integer that gets clamped
     */
    writeSignedInteger(value: AnyNumber): this
    /**
     * Write a unsigned integer
     * @param value A unsigned integer that gets clamped
     */
    writeUnsignedInteger(value: AnyNumber): this
    /**
     * Write a signed long
     * @param value A signed long that gets clamped
     */
    writeSignedLong(value: AnyNumber): this
    /**
     * Write a unsigned long
     * @param value A unsigned long that gets clamped
     */
    writeUnsignedLong(value: AnyNumber): this
    /**
     * Write a IEE 754 float16
     * @param value A IEE 754 float16 that gets clamped
     */
    writeHalf(value: AnyNumber): this
    /**
     * Write a IEE 754 float32
     * @param value A IEE 754 float32 that gets clamped
     */
    writeFloat(value: AnyNumber): this
    /**
     * Write a IEE 754 float64
     * @param value A IEE 754 float64 that gets clamped
     */
    writeDouble(value: AnyNumber): this
    /**
     * Write a arbitrary array buffer
     * @param buffer A array buffer
     */
    writeBuffer(buffer: BinaryDataLike): this
    /**
     * Write a typed array
     * @param type The type of each element in the array
     * @param arr A array
     */
    writeArray<T extends BinaryNumberType>(type: T,arr: Array<BinaryNumberMap[T]>): this
    /**
     * Write a string character
     * @param char A string character
     * @param encoding The decoder to use
     */
    writeCharacter(char: string,encoding: IStringEncoding): this
    /**
     * Write a string
     * @param string A string
     * @param encoding The decoder to use
     */
    writeString(string: string,encoding: IStringEncoding): this
    /**
     * Write a pascal string
     * @param string A string
     * @param lengthType The type of prefixed length
     * @param encoding The decoder to use
     */
    writePascalString(string: string,lengthType: BinaryNumberType,encoding: IStringEncoding): this
    /**
     * Write a struct in the layout of `def`
     * @param def The layout of the struct
     * @param value A struct
     */
    writeStruct<Def extends StructWriterDefinition>(def: Def,value: Struct<Def>): this
    /**
     * Fancy method to write data with paramters instead of method chaining
     * @param type The binary type
     * @param value A bianry value
     */
    write<T extends BinaryNumberType>(type: T,value: BinaryNumberMap[T]): this
}