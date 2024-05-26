import { MAX_DOUBLE, MAX_FLOAT, MAX_S16, MAX_S32, MAX_S64, MAX_S8, MAX_U16, MAX_U32, MAX_U64, MAX_U8, MIN_DOUBLE, MIN_FLOAT, MIN_S16, MIN_S32, MIN_S64, MIN_S8 } from "./limits"
import { StructDefinition, Struct } from "./struct"
import { BinaryNumberMap, BinaryNumberType, Endianness, TypedArray, double, float, s16, s32, s64, s8, u16, u32, u64, u8 } from "./types"
import { clamp, merge_arraybuffer, write_buffer } from "./utils"

/**
 * a better buffer class that that shitty NodeJS `Buffer` class
 */
export class Buffer
{
    /**
     * do not touch, here's where the magic happens :)
     */
    private _view: DataView
    /**
     * the byte order of this buffer, only `"little"` and `"big"` are accepted
     */
    public endianness: Endianness = "little"
    /**
     * the array buffer of this buffer (bufferception)
     */
    public get buffer(){return this._view.buffer}
    /**
     * do people use this property on `DataView`? It's just that
     */
    public get byteOffset(){return this._view.byteOffset}
    /**
     * the size of the buffer
     */
    public get byteLength(){return this._view.byteLength}
    /**
     * the current read position in the buffer
     */
    public readOffset = 0
    /**
     * the current write position in the buffer
     */
    public writeOffset = 0
    /**
     * can we read on the buffer?
     */
    public get readable(){return this.readOffset < this.byteLength}
    /**
     * can we write on the buffer
     */
    public get writable(){return this.writeOffset < this.byteLength}
    /**
     * create a new `Buffer` instance with the size `size`
     * @param size the size of the buffer in bytes
     * @returns a buffer
     */
    public static create(size: number)
    {
        return new this(new ArrayBuffer(size))
    }
    /**
     * create a `Buffer` instance from a response. This method is async!
     * @param response the response object from `fetch` or whatever
     * @returns a buffer (shocking)
     */
    public static async fromResponse(response: Response)
    {
        return new this(await response.arrayBuffer())
    }
    /**
     * create a `Buffer` instance from a blob. This method is async!
     * @param blob the blob from the drain
     * @returns a buffer but not a NodeJS `Buffer` instance
     */
    public static async fromBlob(blob: Blob)
    {
        return new this(await blob.arrayBuffer())
    }
    /**
     * create a `Buffer` instance from a typed array. This includes the NodeJS `Buffer` class because it's just a `Uint8Array` in disguise
     * @param array any kind of typed array
     * @returns a buffer that is better than NodeJS `Buffer`
     */
    public static fromTypedArray(array: TypedArray)
    {
        return new this(array.buffer.slice(array.byteOffset,array.byteOffset + array.byteLength))
    }
    /**
     * create a `Buffer` instance from multiple `Buffer` instances
     * @param buffers array of Buffers
     * @returns one Buffer from all the buffers
     */
    public static merge(...buffers: Array<Buffer>)
    {
        return new this(merge_arraybuffer(buffers.map((buffer) => buffer.buffer)))
    }
    /**
     * create a `Buffer` from a array buffer. These parameters are the same one from `DataView`
     * @param buffer the array buffer we want to read/write from/to
     * @param byteOffset an optional start from where to read/write (will slice the buffer)
     * @param byteLength an optional length of the buffer (will slice the buffer)
     */
    public constructor(buffer: ArrayBufferLike,byteOffset?: number,byteLength?: number)
    {
        this._view = new DataView(buffer,byteOffset,byteLength)
    }
    // I'm not going to f**king comment these all. F**k you 🖕
    public readSignedByte(): s8
    {
        const value = this._view.getInt8(this.readOffset)
        this.readOffset += 1
        return value
    }
    public writeSignedByte(value: s8)
    {
        this._view.setInt8(this.writeOffset,clamp(value,MIN_S8,MAX_S8))
        this.writeOffset += 1
        return this
    }
    public readUnsignedByte(): u8
    {
        const value = this._view.getUint8(this.readOffset)
        this.readOffset += 1
        return value
    }
    public writeUnsignedByte(value: u8)
    {
        this._view.setUint8(this.writeOffset,clamp(value,0,MAX_U8))
        this.writeOffset += 1
        return this
    }
    public readSignedShort(): s16
    {
        const value = this._view.getInt16(this.readOffset,this.endianness == "little")
        this.readOffset += 2
        return value
    }
    public writeSignedShort(value: s16)
    {
        this._view.setInt16(this.writeOffset,clamp(value,MIN_S16,MAX_S16),this.endianness == "little")
        this.writeOffset += 2
        return this
    }
    public readUnsignedShort(): u16
    {
        const value = this._view.getUint16(this.readOffset,this.endianness == "little")
        this.readOffset += 2
        return value
    }
    public writeUnsignedShort(value: u16)
    {
        this._view.setUint16(this.writeOffset,clamp(value,0,MAX_U16),this.endianness == "little")
        this.writeOffset += 2
        return this
    }
    public readSignedInteger(): s32
    {
        const value = this._view.getInt32(this.readOffset,this.endianness == "little")
        this.readOffset += 4
        return value
    }
    public writeSignedInteger(value: s32)
    {
        this._view.setInt32(this.writeOffset,clamp(value,MIN_S32,MAX_S32),this.endianness == "little")
        this.writeOffset += 4
        return this
    }
    public readUnsignedInteger(): u32
    {
        const value = this._view.getUint32(this.readOffset,this.endianness == "little")
        this.readOffset += 4
        return value
    }
    public writeUnsignedInteger(value: u32)
    {
        this._view.setUint32(this.writeOffset,clamp(value,0,MAX_U32),this.endianness == "little")
        this.writeOffset += 4
        return this
    }
    public readSignedLong(): s64
    {
        const value = this._view.getBigInt64(this.readOffset,this.endianness == "little")
        this.readOffset += 8
        return value
    }
    public writeSignedLong(value: s64)
    {
        this._view.setBigInt64(this.writeOffset,clamp(value,MIN_S64,MAX_S64),this.endianness == "little")
        this.writeOffset += 8
        return this
    }
    public readUnsignedLong(): u64
    {
        const value = this._view.getBigUint64(this.readOffset,this.endianness == "little")
        this.readOffset += 8
        return value
    }
    public writeUnsignedLong(value: u64)
    {
        this._view.setBigUint64(this.writeOffset,clamp(value,0n,MAX_U64),this.endianness == "little")
        this.writeOffset += 8
        return this
    }
    public readFloat(): float
    {
        const value = this._view.getFloat32(this.readOffset,this.endianness == "little")
        this.readOffset += 4
        return value
    }
    public writeFloat(value: float)
    {
        this._view.setFloat32(this.writeOffset,clamp(value,MIN_FLOAT,MAX_FLOAT),this.endianness == "little")
        this.writeOffset += 4
        return this
    }
    public readDouble(): double
    {
        const value = this._view.getFloat64(this.readOffset,this.endianness == "little")
        this.readOffset += 8
        return value
    }
    public writeDouble(value: double)
    {
        this._view.setFloat64(this.writeOffset,clamp(value,MIN_DOUBLE,MAX_DOUBLE),this.endianness == "little")
        this.writeOffset += 8
        return this
    }
    // ok here can I comment now
    /**
     * read an abitary array buffer from the buffer
     * @param size the size of the buffer in bytes
     * @returns a array buffer (not a buffer? (bro, just use `new Buffer(theReturnValueOfThisMethod)`))
     */
    public readBuffer(size: number)
    {
        const buffer = this._view.buffer.slice(this.readOffset,this.readOffset + size)
        this.readOffset += size
        return buffer
    }
    /**
     * write a abitary array buffer to this buffer
     * @param buffer the array buffer to use
     * @returns this 👇
     */
    public writeBuffer(buffer: ArrayBufferLike)
    {
        const target = this.buffer
        write_buffer(target,buffer,this.writeOffset)
        this.writeOffset += buffer.byteLength
        this._view = new DataView(target)
        return this
    }
    /**
     * read an array with `type` and size of `length` from this buffer
     * @param type the type of array
     * @param length the length of the array
     * @returns the array
     */
    public readArray<T extends BinaryNumberType>(type: T,length: number): Array<BinaryNumberMap[T]>
    {
        const arr: Array<BinaryNumberMap[T]> = []
        for(let i = 0;i < length;i++)
            arr.push(this.read(type))
        return arr
    }
    /**
     * write an array `arr` as `type` to this buffer
     * @param type the type of arry
     * @param arr the array itself
     * @returns this 👇
     */
    public writeArray<T extends BinaryNumberType>(type: T,arr: Array<BinaryNumberMap[T]>)
    {
        for(const value of arr)
            this.write(type,value)
        return this
    }
    /**
     * read a ascii character from the buffer
     * @returns a character
     */
    public readChar()
    {
        return String.fromCharCode(this.readUnsignedByte())
    }
    /**
     * write `char` into the buffer
     * @param char the character to write
     * @returns this 👇
     */
    public writeChar(char: string)
    {
        return this.writeUnsignedByte(char.charCodeAt(0))
    }
    /**
     * read an ascii string with the length `length`
     * @param length the length of the text
     * @returns a string in ascii
     */
    public readASCII(length: number)
    {
        return String.fromCharCode(...this.readArray("u8",length))
    }
    /**
     * write an ascii text `text` into the buffer
     * @param text the text in ascii (will convert it into ascii, so UTF-8 shit gets removed)
     * @returns this 👇
     */
    public writeASCII(text: string)
    {
        return this.writeArray("u8",text.split("").map((char) => char.charCodeAt(0) & 0xff))
    }
    /**
     * read a struct from the buffer with a definition
     * @param def the structure of the struct
     * @returns the struct
     */
    public readStruct<Def extends StructDefinition>(def: Def): Struct<Def>
    {
        const struct: Record<string,any> = {}
        for(const [name,type] of Object.entries(def))
        {
            if(typeof type == "string")
            {
                struct[name] = this.read(type)
                continue
            }
            if(typeof type == "number")
            {
                struct[name] = this.readBuffer(type)
                continue
            }
            if(typeof type == "function")
            {
                struct[name] = type(this)
                continue
            }
            if(typeof type == "object")
            {
                struct[name] = this.readStruct(type)
                continue
            }
        }
        return struct as Struct<Def>
    }
    /**
     * fancy function for reading data by using a parameter `type` instead of methods
     * @param type the type to read
     * @returns the value as the type
     */
    public read<T extends BinaryNumberType>(type: T): BinaryNumberMap[T]
    {
        switch(type)
        {
            case "s8":
                return this.readSignedByte() as BinaryNumberMap[T]
            case "u8":
                return this.readUnsignedByte() as BinaryNumberMap[T]
            case "s16":
                return this.readSignedShort() as BinaryNumberMap[T]
            case "u16":
                return this.readUnsignedShort() as BinaryNumberMap[T]
            case "s32":
                return this.readSignedInteger() as BinaryNumberMap[T]
            case "u32":
                return this.readUnsignedInteger() as BinaryNumberMap[T]
            case "s64":
                return this.readSignedLong() as BinaryNumberMap[T]
            case "u64":
                return this.readUnsignedLong() as BinaryNumberMap[T]
            case "float":
                return this.readFloat() as BinaryNumberMap[T]
            case "double":
                return this.readDouble() as BinaryNumberMap[T]
            default:
                throw new TypeError(`unknown binary type '${type}'`)
        }
    }
    /**
     * fancy method to write data with paramters instead of method chaining
     * @param type the type of the value
     * @param value the value
     * @returns this 👇
     */
    public write<T extends BinaryNumberType>(type: T,value: BinaryNumberMap[T])
    {
        switch(type)
        {
            case "s8":
                return this.writeSignedByte(value as number)
            case "u8":
                return this.writeUnsignedByte(value as number)
            case "s16":
                return this.writeSignedShort(value as number)
            case "u16":
                return this.writeUnsignedShort(value as number)
            case "s32":
                return this.writeSignedInteger(value as number)
            case "u32":
                return this.writeUnsignedInteger(value as number)
            case "s64":
                return this.writeSignedLong(value as bigint)
            case "u64":
                return this.writeUnsignedLong(value as bigint)
            case "float":
                return this.writeFloat(value as number)
            case "double":
                return this.writeDouble(value as number)
            default:
                throw new TypeError(`unknown binary type '${type}'`)
        }
    }
}