import { IStringEncoding } from "./string"
import { Struct, StructReaderDefinition } from "./struct"
import { AnyNumber, BinaryNumberMap, BinaryNumberType, double, float, half, s16, s24, s32, s64, s8, u16, u24, u32, u64, u8 } from "./types"

/**
 * Interface for reading binary data
 */
export interface IReader
{
    /**
     * The current read position in bytes
     */
    readOffset: number
    /**
     * Set the read position
     * @param offset A offset in bytes
     */
    setReadOffset(offset: AnyNumber): this
    /**
     * Is this object still readable?
     */
    readonly readable: boolean
    /**
     * Read a signed byte
     */
    readSignedByte(): s8
    /**
     * Read a unsigned byte
     */
    readUnsignedByte(): u8
    /**
     * Read a signed short
     */
    readSignedShort(): s16
    /**
     * Read a unsigned short
     */
    readUnsignedShort(): u16
    /**
     * Read a signed 24-bit number
     */
    readSigned24(): s24
    /**
     * Read a unsigned 24-bit number
     */
    readUnsigned24(): u24
    /**
     * Read a signed integer
     */
    readSignedInteger(): s32
    /**
     * Read a unsigned integer
     */
    readUnsignedInteger(): u32
    /**
     * Read a signed long
     */
    readSignedLong(): s64
    /**
     * Read a unsigned long
     */
    readUnsignedLong(): u64
    /**
     * Read a IEE 754 float16
     */
    readHalf(): half
    /**
     * Read a IEE 754 float32
     */
    readFloat(): float
    /**
     * Read a IEE 754 float64
     */
    readDouble(): double
    /**
     * Read an fixed array buffer
     * @param size The size of the buffer in bytes
     */
    readBuffer(size: AnyNumber): ArrayBuffer
    /**
     * Read an fixed array with `type` and size of `length`
     * @param type The type of array
     * @param length The length of the array
     */
    readArray<T extends BinaryNumberType>(type: T,length: number): Array<BinaryNumberMap[T]>
    /**
     * Read a string character
     * @param encoding The encoder to use
     */
    readCharacter(encoding: IStringEncoding): string
    /**
     * Read a string
     * @param length The length of the text
     * @param encoding The encoder to use
     */
    readString(length: AnyNumber,encoding: IStringEncoding): string
    /**
     * Read a pascal string
     * @param lengthType The type of prefixed length
     * @param encoding The encoder to use
     */
    readPascalString(lengthType: BinaryNumberType,encoding: IStringEncoding): string
    /**
     * Read a struct with a definition
     * @param def The layout of the struct
     * @throws Layout does not match result
     */
    readStruct<Def extends StructReaderDefinition>(def: Def): Struct<Def>
    /**
     * Fancy function for reading data by using a parameter `type` instead of methods
     * @param type The binary type to read
     */
    read<T extends BinaryNumberType>(type: T): BinaryNumberMap[T]
}