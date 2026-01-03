import { IBinaryData } from "./binary"
import { MAX_DOUBLE, MAX_FLOAT, MAX_HALF, MAX_S16, MAX_S24, MAX_S32, MAX_S64, MAX_S8, MAX_U16, MAX_U32, MAX_U64, MAX_U8, MIN_DOUBLE, MIN_FLOAT, MIN_HALF, MIN_S16, MIN_S24, MIN_S32, MIN_S64, MIN_S8 } from "./limits"
import { IStringEncoding } from "./string"
import { Struct, StructWriterDefinition, StructReaderDefinition } from "./struct"
import { AnyNumber, BinaryDataLike, BinaryNumberMap, BinaryNumberType, Endianness, IArrayBufferView, IAsyncArrayBuffer, double, ensureBinaryNumber, float, half, isAnyArrayBuffer, resolveBinaryDataLike, s16, s24, s32, s64, s8, u16, u24, u32, u64, u8 } from "./types"
import { clamp, createArrayBuffer, mergeArraybuffer, writeBuffer } from "./utils"

/**
 * A region of memory that can be written and/or read
 */
export class MemoryRegion implements IBinaryData, IArrayBufferView
{
//#region Properties
    /**
     * The DataView object used to manipulate the binary data
     */
    private _view: DataView
    public endianness: Endianness = "little"
    /**
     * The array buffer of this memory region
     */
    public get buffer(): ArrayBufferLike {return this._view.buffer}
    public get byteOffset(): number {return this._view.byteOffset}
    public get byteLength(): number{return this._view.byteLength}
    public readOffset: number = 0
    public writeOffset: number = 0
    public get readable(): boolean {return this.readOffset < this.byteLength}
    public get writable(): boolean {return this.writeOffset < this.byteLength}
//#endregion
//#region Static methods
    /**
     * Allocate a new `MemoryRegion` with the provided size
     * @param size Size in bytes
     */
    public static allocate(size: AnyNumber): MemoryRegion
    {
        return new this(createArrayBuffer(size))
    }
    /**
     * Create a `MemoryRegion` from an asyncronize process such as `Response` or `Blob`
     * @param response A asyncronize object that implements {@link IAsyncArrayBuffer}
     */
    public static async fromAsync(response: IAsyncArrayBuffer): Promise<MemoryRegion>
    {
        return new this(await response.arrayBuffer())
    }
    /**
     * Create a `MemoryRegion` from a binary view such as this class, typed arrays and NodeJS's `Buffer` class
     * @param array A object that implements {@link IArrayBufferView}
     */
    public static fromArrayBufferView(array: IArrayBufferView): MemoryRegion
    {
        return new this(array.buffer.slice(array.byteOffset,array.byteOffset + array.byteLength))
    }
    /**
     * Mergy binary data into a `MemoryRegion`
     * @param buffers A list of binary data
     */
    public static merge(...buffers: Array<BinaryDataLike>): MemoryRegion
    {
        return new this(mergeArraybuffer(...buffers.map(resolveBinaryDataLike)))
    }
    /**
     * Create a memory region for a array buffer
     * @param buffer A array buffer
     * @param byteOffset A offset in bytes
     * @param byteLength A fixed length
     */
//#endregion
//#region Constructor
    public constructor(buffer: BinaryDataLike,byteOffset?: number,byteLength?: number)
    {
        this._view = new DataView(resolveBinaryDataLike(buffer),byteOffset,byteLength)
    }
//#endregion
//#region Read/Write methods
    public readSignedByte(): s8
    {
        const value = this._view.getInt8(this.readOffset)
        this.readOffset += 1
        return value
    }
    public writeSignedByte(value: AnyNumber): this
    {
        this._view.setInt8(this.writeOffset,clamp(Number(value),MIN_S8,MAX_S8))
        this.writeOffset += 1
        return this
    }
    public readUnsignedByte(): u8
    {
        const value = this._view.getUint8(this.readOffset)
        this.readOffset += 1
        return value
    }
    public writeUnsignedByte(value: AnyNumber): this
    {
        this._view.setUint8(this.writeOffset,clamp(Number(value),0,MAX_U8))
        this.writeOffset += 1
        return this
    }
    public readSignedShort(): s16
    {
        const value = this._view.getInt16(this.readOffset,this.endianness === "little")
        this.readOffset += 2
        return value
    }
    public writeSignedShort(value: AnyNumber): this
    {
        this._view.setInt16(this.writeOffset,clamp(Number(value),MIN_S16,MAX_S16),this.endianness === "little")
        this.writeOffset += 2
        return this
    }
    public readUnsignedShort(): u16
    {
        const value = this._view.getUint16(this.readOffset,this.endianness === "little")
        this.readOffset += 2
        return value
    }
    public writeUnsignedShort(value: AnyNumber): this
    {
        this._view.setUint16(this.writeOffset,clamp(Number(value),0,MAX_U16),this.endianness === "little")
        this.writeOffset += 2
        return this
    }
    public readSigned24(): s24
    {
        const value = this.readUnsigned24()
        return value & MAX_S24 ? value | 0xff000000 : value
    }
    public writeUnsigned24(value: AnyNumber): this
    {
        const v = Number(value)
        const a = this.endianness === "little" ? v & 0xff : (v >> 16) & 0xff
        const b = (v >> 8) & 0xff
        const c = this.endianness === "little" ? (v >> 16) & 0xff : v & 0xff
        return this.writeUnsignedByte(a).writeUnsignedByte(b).writeUnsignedByte(c)
    }
    public readUnsigned24(): u24
    {
        const a = this.readUnsignedByte()
        const b = this.readUnsignedByte()
        const c = this.readUnsignedByte()
        return this.endianness === "little" ? (a + (b << 8) + (c << 16)) : ((a << 16) + (b << 8) + c)
    }
    public writeSigned24(value: AnyNumber): this
    {
        return this.writeUnsigned24(clamp(Number(value),MIN_S24,MAX_S24))
    }
    public readSignedInteger(): s32
    {
        const value = this._view.getInt32(this.readOffset,this.endianness === "little")
        this.readOffset += 4
        return value
    }
    public writeSignedInteger(value: AnyNumber): this
    {
        this._view.setInt32(this.writeOffset,clamp(Number(value),MIN_S32,MAX_S32),this.endianness === "little")
        this.writeOffset += 4
        return this
    }
    public readUnsignedInteger(): u32
    {
        const value = this._view.getUint32(this.readOffset,this.endianness === "little")
        this.readOffset += 4
        return value
    }
    public writeUnsignedInteger(value: AnyNumber): this
    {
        this._view.setUint32(this.writeOffset,clamp(Number(value),0,MAX_U32),this.endianness === "little")
        this.writeOffset += 4
        return this
    }
    public readSignedLong(): s64
    {
        const value = this._view.getBigInt64(this.readOffset,this.endianness === "little")
        this.readOffset += 8
        return value
    }
    public writeSignedLong(value: AnyNumber): this
    {
        this._view.setBigInt64(this.writeOffset,clamp(BigInt(value),MIN_S64,MAX_S64),this.endianness === "little")
        this.writeOffset += 8
        return this
    }
    public readUnsignedLong(): u64
    {
        const value = this._view.getBigUint64(this.readOffset,this.endianness === "little")
        this.readOffset += 8
        return value
    }
    public writeUnsignedLong(value: AnyNumber): this
    {
        this._view.setBigUint64(this.writeOffset,clamp(BigInt(value),0n,MAX_U64),this.endianness === "little")
        this.writeOffset += 8
        return this
    }
    public readHalf(): half
    {
        const value = this._view.getFloat16(this.readOffset,this.endianness === "little")
        this.readOffset += 2
        return value
    }
    public writeHalf(value: AnyNumber): this
    {
        this._view.setFloat16(this.writeOffset,clamp(Number(value),MIN_HALF,MAX_HALF),this.endianness === "little")
        this.writeOffset += 2
        return this
    }
    public readFloat(): float
    {
        const value = this._view.getFloat32(this.readOffset,this.endianness === "little")
        this.readOffset += 4
        return value
    }
    public writeFloat(value: AnyNumber): this
    {
        this._view.setFloat32(this.writeOffset,clamp(Number(value),MIN_FLOAT,MAX_FLOAT),this.endianness === "little")
        this.writeOffset += 4
        return this
    }
    public readDouble(): double
    {
        const value = this._view.getFloat64(this.readOffset,this.endianness === "little")
        this.readOffset += 8
        return value
    }
    public writeDouble(value: AnyNumber): this
    {
        this._view.setFloat64(this.writeOffset,clamp(Number(value),MIN_DOUBLE,MAX_DOUBLE),this.endianness === "little")
        this.writeOffset += 8
        return this
    }
//#region Buffer methods
    public readBuffer(size: AnyNumber): ArrayBuffer
    {
        let buffer = mergeArraybuffer()
        const length = BigInt(size)
        for(let i = 0n;i < length;i++)
        {
            const value = this.readUnsignedByte()
            buffer = mergeArraybuffer(buffer,u8(value))
        }
        return buffer
    }
    public writeBuffer(buffer: BinaryDataLike): this
    {
        const data = resolveBinaryDataLike(buffer)
        writeBuffer(this.buffer,data,this.writeOffset)
        this.writeOffset += data.byteLength
        this._view = new DataView(this.buffer,this.byteOffset,this.byteLength)
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
    public writeArray<T extends BinaryNumberType>(type: T,arr: Array<BinaryNumberMap[T]>): this
    {
        for(const value of arr)
            this.write(type,value)
        return this
    }
//#endregion
//#region String methods
    public readCharacter(encoding: IStringEncoding): string
    {
        return this.readString(1,encoding)
    }
    public writeCharacter(char: string,encoding: IStringEncoding): this
    {
        if(char.length !== 1)
            throw new TypeError("char is not a character")
        return this.writeString(char[0]!,encoding)
    }
    public readString(length: AnyNumber,encoding: IStringEncoding): string
    {
        return encoding.decode(this,length)
    }
    public writeString(string: string,encoding: IStringEncoding): this
    {
        return this.writeBuffer(encoding.encode(string))
    }
    public readPascalString(lengthType: BinaryNumberType,encoding: IStringEncoding): string
    {
        const length = this.read(lengthType)
        return this.readString(length,encoding)
    }
    public writePascalString(string: string,lengthType: BinaryNumberType,encoding: IStringEncoding): this
    {
        return this
        .write(lengthType,string.length)
        .writeString(string,encoding)
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
        return struct as Struct<Def> // TODO: remove "as"
    }
    public writeStruct<Def extends StructWriterDefinition>(def: Def,value: Struct<Def>): this
    {
        for(const [name,type] of Object.entries(def))
        {
            const v = value[name]
            if(typeof type == "string" && typeof v == "number")
            {
                this.write(type,v)
                continue
            }
            else if(typeof type == "number" && isAnyArrayBuffer(v))
            {
                this.writeBuffer(v)
                continue
            }
            else if(typeof type == "object" && typeof v == "object" && !isAnyArrayBuffer(v))
            {
                this.writeStruct(type,v)
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
                return ensureBinaryNumber(this.readSignedByte(),type)
            case "u8":
                return ensureBinaryNumber(this.readUnsignedByte(),type)
            case "s16":
                return ensureBinaryNumber(this.readSignedShort(),type)
            case "u16":
                return ensureBinaryNumber(this.readUnsignedShort(),type)
            case "s24":
                return ensureBinaryNumber(this.readSigned24(),type)
            case "u24":
                return ensureBinaryNumber(this.readUnsigned24(),type)
            case "s32":
                return ensureBinaryNumber(this.readSignedInteger(),type)
            case "u32":
                return ensureBinaryNumber(this.readUnsignedInteger(),type)
            case "s64":
                return ensureBinaryNumber(this.readSignedLong(),type)
            case "u64":
                return ensureBinaryNumber(this.readUnsignedLong(),type)
            case "half":
                return ensureBinaryNumber(this.readHalf(),type)
            case "float":
                return ensureBinaryNumber(this.readFloat(),type)
            case "double":
                return ensureBinaryNumber(this.readDouble(),type)
            default:
                throw new TypeError(`unknown binary type '${type}'`)
        }
    }
    public write<T extends BinaryNumberType>(type: T,value: BinaryNumberMap[T]): this
    {
        switch(type)
        {
            case "s8":
                return this.writeSignedByte(ensureBinaryNumber(value,type))
            case "u8":
                return this.writeUnsignedByte(ensureBinaryNumber(value,type))
            case "s16":
                return this.writeSignedShort(ensureBinaryNumber(value,type))
            case "u16":
                return this.writeUnsignedShort(ensureBinaryNumber(value,type))
            case "s24":
                return this.writeSigned24(ensureBinaryNumber(value,type))
            case "u24":
                return this.writeUnsigned24(ensureBinaryNumber(value,type))
            case "s32":
                return this.writeSignedInteger(ensureBinaryNumber(value,type))
            case "u32":
                return this.writeUnsignedInteger(ensureBinaryNumber(value,type))
            case "s64":
                return this.writeSignedLong(ensureBinaryNumber(value,type))
            case "u64":
                return this.writeUnsignedLong(ensureBinaryNumber(value,type))
            case "half":
                return this.writeHalf(ensureBinaryNumber(value,type))
            case "float":
                return this.writeFloat(ensureBinaryNumber(value,type))
            case "double":
                return this.writeDouble(ensureBinaryNumber(value,type))
            default:
                throw new TypeError(`unknown binary type '${type}'`)
        }
    }
//#endregion
//#region Methods
    public setEndianness(endianness: Endianness): this
    {
        this.endianness = endianness
        return this
    }
    public setReadOffset(offset: AnyNumber): this
    {
        this.readOffset = Number(offset)
        return this
    }
    public setWriteOffset(offset: AnyNumber): this
    {
        this.writeOffset = Number(offset)
        return this
    }
    /**
     * Map each byte with a new byte
     * @param cb A function that maps each byte to a new byte
     */
    public map(cb: MemoryRegion.Mapper): this
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
        // set offsets back to original
        this.writeOffset = wOffset
        this.readOffset = rOffset
        return this
    }
//#endregion
//#region Symbols
    public async *[Symbol.asyncIterator](): AsyncIterator<u8>
    {
        while(this.readable)
            yield this.readUnsignedByte()
    }
    public *[Symbol.iterator](): Iterator<u8>
    {
        while(this.readable)
            yield this.readUnsignedByte()
    }
    public [Symbol.toPrimitive](hint: "number" | "string" | "default"): string | number
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
    public get [Symbol.toStringTag](): "MemoryRegion"
    {
        return "MemoryRegion"
    }
    /**
     * Returns a string representation of an object.
     */
    public toString(): MemoryRegion.Stringified
    {
        return `MemoryRegion<${this._view.byteLength}>`
    }
    /**
     * Convert this region into a valid JSON object, used by `JSON.stringify`
     */
    public toJSON(): IMemoryRegion
    {
        return {
            type: "MemoryRegion",
            data: [...this]
        }
    }
//#endregion
}
//#region Types
export namespace MemoryRegion
{
    /**
     * The mapper function used in `Buffer.map`
     * @param byte The current byte
     * @param offset The offset of the current byte in the buffer
     * @param buffer The buffer being read through
     */
    export type Mapper = (byte: u8,offset: number,region: MemoryRegion) => u8
    /**
     * The `Buffer.toString` type
     */
    export type Stringified = `MemoryRegion<${number}>`
}

/**
 * A interface representation of the `MemoryRegion` class (it's the return type of `MemoryRegion.toJSON`). This has the same structure as the NodeJS's `Buffer.toJSON` method
 */
export interface IMemoryRegion
{
    type: "MemoryRegion"
    data: Array<number>
}
//#endregion