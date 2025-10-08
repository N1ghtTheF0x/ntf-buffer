import { ISerializable } from "./serialize"
import { Struct, StructReaderDefinition } from "./struct"
import { BinaryNumberMap, BinaryNumberType, double, float, half, s16, s24, s32, s64, s8, u16, u24, u32, u64, u8 } from "./types"

/**
 * Interface for reading binary data
 */
export interface IReader
{
    /**
     * the current read position
     */
    readOffset: number
    /**
     * can we read?
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
     * read an arbitrary array buffer from the buffer
     * @param size the size of the buffer in bytes
     * @returns a array buffer (not a buffer? (bro, just use `new Buffer(theReturnValueOfThisMethod)`))
     */
    readBuffer(size: number): ArrayBufferLike
    /**
     * read an array with `type` and size of `length` from this buffer
     * @param type the type of array
     * @param length the length of the array
     * @returns the array
     */
    readArray<T extends BinaryNumberType>(type: T,length: number): Array<BinaryNumberMap[T]>
    /**
     * read a ascii character from the buffer
     * @returns a character
     */
    readChar(): string
    /**
     * read an ascii string with the length `length`
     * @param length the length of the text
     * @returns a string in ascii
     */
    readASCII(length: number): string
    /**
     * read a struct from the buffer with a definition
     * @param def the structure of the struct
     * @returns the struct
     */
    readStruct<Def extends StructReaderDefinition>(def: Def): Struct<Def>
    /**
     * fancy function for reading data by using a parameter `type` instead of methods
     * @param type the type to read
     * @returns the value as the type
     */
    read<T extends BinaryNumberType>(type: T): BinaryNumberMap[T]
    /**
     * Deserialize `object` by reading from the buffer. The object needs to implement {@link ISerializable}
     * @param object The object to deserialize
     * @returns The object deserialized
     */
    readObject<O extends ISerializable>(object: O): O
}