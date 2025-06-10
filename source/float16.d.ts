// TODO: remove this shit
declare interface Float16Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike>
{
    readonly buffer: TArrayBuffer
    readonly byteOffset: number
    readonly byteLength: number
    [index: number]: number
}

declare interface Float16ArrayConstructor<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike>
{
    new (array: ArrayLike<number> | Iterable<number>): Float16Array<ArrayBuffer>
}

declare var Float16Array: Float16ArrayConstructor

declare interface DataView<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike>
{
    setFloat16(byteOffset: number,value: number,littleEndian?: boolean): void
    getFloat16(byteOffset: number,littleEndian?: boolean): number
}