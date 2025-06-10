import { MAX_DOUBLE, MAX_FLOAT, MAX_HALF, MAX_S16, MAX_S32, MAX_S64, MAX_S8, MAX_U16, MAX_U32, MAX_U64, MAX_U8, MIN_DOUBLE, MIN_FLOAT, MIN_HALF, MIN_S16, MIN_S32, MIN_S64, MIN_S8 } from "./limits"
import { IReader } from "./reader"
import { DESERIALSIZE_SYMBOL, ISerializable, SERIALIZE_SYMBOL } from "./serialize"
import { Struct, StructWriterDefinition, StructReaderDefinition } from "./struct"
import { BinaryNumberMap, BinaryNumberType, Endianness, IAsyncArrayBuffer, TypedArray, double, float, half, s16, s32, s64, s8, u16, u32, u64, u8 } from "./types"
import { clamp, merge_arraybuffer, write_buffer } from "./utils"
import { IWriter } from "./writer"

/**
 * a better buffer class that that shitty NodeJS `Buffer` class
 */
export class Buffer implements IReader, IWriter
{
//#region Properties
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
    
    public readOffset = 0
    public writeOffset = 0
    public get readable(){return this.readOffset < this.byteLength}
    public get writable(){return this.writeOffset < this.byteLength}
    /**
     * create a new `Buffer` instance with the size `size`
     * @param size the size of the buffer in bytes
     * @returns a buffer
     */
//#endregion
//#region Static methods
    public static create(size: number)
    {
        return new this(new ArrayBuffer(size))
    }
    /**
     * create a `Buffer` instance from a response/blob. This method is async!
     * @param response the response object from `fetch`, a blob or whatever implements {@link IAsyncArrayBuffer}
     * @returns a buffer (shocking)
     */
    public static async fromAsync(response: IAsyncArrayBuffer)
    {
        return new this(await response.arrayBuffer())
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
     * @param buffers array of (Array)Buffers
     * @returns one Buffer from all the buffers
     */
    public static merge(...buffers: Array<Buffer | ArrayBufferLike>)
    {
        return new this(merge_arraybuffer(buffers.map((buffer) => "buffer" in buffer ? buffer.buffer : buffer)))
    }
    /**
     * create a `Buffer` from a array buffer. These parameters are the same one from `DataView`
     * @param buffer the array buffer we want to read/write from/to
     * @param byteOffset an optional start from where to read/write (will slice the buffer)
     * @param byteLength an optional length of the buffer (will slice the buffer)
     */
//#endregion
//#region Constructor
    public constructor(buffer: ArrayBufferLike,byteOffset?: number,byteLength?: number)
    {
        this._view = new DataView(buffer,byteOffset,byteLength)
    }
//#endregion
//#region R/W methods
    // welp guess I did comment these in "reader.ts" and "writer.ts"...
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
        const value = this._view.getInt16(this.readOffset,this.endianness === "little")
        this.readOffset += 2
        return value
    }
    public writeSignedShort(value: s16)
    {
        this._view.setInt16(this.writeOffset,clamp(value,MIN_S16,MAX_S16),this.endianness === "little")
        this.writeOffset += 2
        return this
    }
    public readUnsignedShort(): u16
    {
        const value = this._view.getUint16(this.readOffset,this.endianness === "little")
        this.readOffset += 2
        return value
    }
    public writeUnsignedShort(value: u16)
    {
        this._view.setUint16(this.writeOffset,clamp(value,0,MAX_U16),this.endianness === "little")
        this.writeOffset += 2
        return this
    }
    public readSignedInteger(): s32
    {
        const value = this._view.getInt32(this.readOffset,this.endianness === "little")
        this.readOffset += 4
        return value
    }
    public writeSignedInteger(value: s32)
    {
        this._view.setInt32(this.writeOffset,clamp(value,MIN_S32,MAX_S32),this.endianness === "little")
        this.writeOffset += 4
        return this
    }
    public readUnsignedInteger(): u32
    {
        const value = this._view.getUint32(this.readOffset,this.endianness === "little")
        this.readOffset += 4
        return value
    }
    public writeUnsignedInteger(value: u32)
    {
        this._view.setUint32(this.writeOffset,clamp(value,0,MAX_U32),this.endianness === "little")
        this.writeOffset += 4
        return this
    }
    public readSignedLong(): s64
    {
        const value = this._view.getBigInt64(this.readOffset,this.endianness === "little")
        this.readOffset += 8
        return value
    }
    public writeSignedLong(value: s64)
    {
        this._view.setBigInt64(this.writeOffset,clamp(value,MIN_S64,MAX_S64),this.endianness === "little")
        this.writeOffset += 8
        return this
    }
    public readUnsignedLong(): u64
    {
        const value = this._view.getBigUint64(this.readOffset,this.endianness === "little")
        this.readOffset += 8
        return value
    }
    public writeUnsignedLong(value: u64)
    {
        this._view.setBigUint64(this.writeOffset,clamp(value,0n,MAX_U64),this.endianness === "little")
        this.writeOffset += 8
        return this
    }
    public readHalf(): half
    {
        const value = this._view.getFloat16(this.readOffset,this.endianness === "little")
        this.readOffset += 2
        return value
    }
    public writeHalf(value: half)
    {
        this._view.setFloat16(this.writeOffset,clamp(value,MIN_HALF,MAX_HALF),this.endianness === "little")
        this.writeOffset += 2
        return this
    }
    public readFloat(): float
    {
        const value = this._view.getFloat32(this.readOffset,this.endianness === "little")
        this.readOffset += 4
        return value
    }
    public writeFloat(value: float)
    {
        this._view.setFloat32(this.writeOffset,clamp(value,MIN_FLOAT,MAX_FLOAT),this.endianness === "little")
        this.writeOffset += 4
        return this
    }
    public readDouble(): double
    {
        const value = this._view.getFloat64(this.readOffset,this.endianness === "little")
        this.readOffset += 8
        return value
    }
    public writeDouble(value: double)
    {
        this._view.setFloat64(this.writeOffset,clamp(value,MIN_DOUBLE,MAX_DOUBLE),this.endianness === "little")
        this.writeOffset += 8
        return this
    }
    // no comments found here
//#region Buffer methods
    public readBuffer(size: number)
    {
        const buffer = this._view.buffer.slice(this.readOffset,this.readOffset + size)
        this.readOffset += size
        return buffer
    }
    public writeBuffer(buffer: ArrayBufferLike)
    {
        const target = this.buffer
        write_buffer(target,buffer,this.writeOffset)
        this.writeOffset += buffer.byteLength
        this._view = new DataView(target)
        return this
    }
//#endregion
//#region Array methods
    public readArray<T extends BinaryNumberType>(type: T,length: number): Array<BinaryNumberMap[T]>
    {
        const arr: Array<BinaryNumberMap[T]> = []
        for(let i = 0;i < length;i++)
            arr.push(this.read(type))
        return arr
    }
    public writeArray<T extends BinaryNumberType>(type: T,arr: Array<BinaryNumberMap[T]>)
    {
        for(const value of arr)
            this.write(type,value)
        return this
    }
//#endregion
//#region String methods
    public readChar()
    {
        return String.fromCharCode(this.readUnsignedByte())
    }
    public writeChar(char: string)
    {
        return this.writeUnsignedByte(char.charCodeAt(0))
    }
    public readASCII(length: number)
    {
        return String.fromCharCode(...this.readArray("u8",length))
    }
    public writeASCII(text: string)
    {
        return this.writeArray("u8",text.split("").map((char) => char.charCodeAt(0) & 0xff))
    }
//#endregion
//#region Struct methods
    public readStruct<Def extends StructReaderDefinition>(def: Def): Struct<Def>
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
    public writeStruct<Def extends StructWriterDefinition>(def: Def,value: Struct<Def>)
    {
        for(const [name,type] of Object.entries(def))
        {
            const v = value[name]
            if(typeof type == "string")
            {
                this.write(type,v as number)
                continue
            }
            if(typeof type == "number")
            {
                this.writeBuffer(v as ArrayBuffer)
                continue
            }
            if(typeof type == "object")
            {
                this.writeStruct(type,v as any)
                continue
            }
        }
        return this
    }
//#endregion
//#region Typed read/write methods
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
            case "half":
                return this.readHalf() as BinaryNumberMap[T]
            case "float":
                return this.readFloat() as BinaryNumberMap[T]
            case "double":
                return this.readDouble() as BinaryNumberMap[T]
            default:
                throw new TypeError(`unknown binary type '${type}'`)
        }
    }
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
            case "half":
                return this.writeHalf(value as number)
            case "float":
                return this.writeFloat(value as number)
            case "double":
                return this.writeDouble(value as number)
            default:
                throw new TypeError(`unknown binary type '${type}'`)
        }
    }
//#endregion
//#region Methods
    // jk, here are comments
    /**
     * Map each byte with a new byte
     * @param cb The mapper function with the signature: {@link Buffer.Mapper `(byte,offset,buffer) => byte`}
     * @returns this 👇
     */
    public map(cb: Buffer.Mapper)
    {
        // save current offset
        const wOffset = this.writeOffset, rOffset = this.readOffset
        this.writeOffset = this.readOffset = 0
        // go through each value from start to end
        while(this.writable)
        {
            // read the byte
            let value = this.readUnsignedByte()
            // get the new byte
            value = cb(this.readUnsignedByte(),this.readOffset,this)
            // write the new byte
            this.writeUnsignedByte(value)
        }
        // set offsets back to orignal
        this.writeOffset = wOffset
        this.readOffset = rOffset
        return this
    }
//#endregion
//#region Serialization methods
    public writeObject<O extends ISerializable>(object: O)
    {
        return this.writeBuffer(object[SERIALIZE_SYMBOL]()._view.buffer)
    }
    public readObject<O extends ISerializable>(object: O)
    {
        return object[DESERIALSIZE_SYMBOL](this)
    }
//#endregion
//#region Symbols
    public async *[Symbol.asyncIterator]()
    {
        while(this.readable)
            yield this.readUnsignedByte()
    }
    public *[Symbol.iterator]()
    {
        while(this.readable)
            yield this.readUnsignedByte()
    }
    public [Symbol.toPrimitive](hint: "number" | "string" | "default")
    {
        switch(hint)
        {
            default:
            case "default":
            case "string":
                return this.toString()
            case "number":
                return this._view.byteLength
        }
    }
    public get [Symbol.toStringTag](): "Buffer"
    {
        return "Buffer"
    }
    /**
     * Returns a string representation of an object.
     */
    public toString(): Buffer.Stringified
    {
        return `Buffer<${this._view.byteLength}>`
    }
    /**
     * Convert this Buffer into a valid JSON object, used by `JSON.stringify`
     * @returns A valid {@link IBuffer JSON object}
     */
    public toJSON(): IBuffer
    {
        return {
            type: "Buffer",
            data: [...this]
        }
    }
//#endregion
}
//#region Types
export namespace Buffer
{
    /**
     * The mapper function used in `Buffer.map`
     * @param byte The current byte
     * @param offset The offset of the current byte in the buffer
     * @param buffer The buffer being read through
     * @returns The new value of `byte`
     */
    export type Mapper = (byte: u8,offset: number,buffer: Buffer) => u8
    /**
     * The `Buffer.toString` type
     */
    export type Stringified = `Buffer<${number}>`
}

/**
 * A interface representation of the `Buffer` class (it's the type of `Buffer.toJSON`). This has the same structure as the NodeJS's `Buffer.toJSON` method
 */
export interface IBuffer
{
    type: "Buffer"
    data: Array<number>
}
//#endregion