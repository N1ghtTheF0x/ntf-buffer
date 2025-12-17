import { AnyNumber } from "./types"

/**
 * Clamp `value` between `min` and `max`
 * @param value A value
 * @param min The minimum allowed value
 * @param max The maximum allowed value
 */
export function clamp<T extends AnyNumber>(value: T,min: T,max: T): T
{
    if(min >= value) // if value is smaller than min
        return min // give me min
    if(max <= value) // if value is bigger than max
        return max // give me max
    return value // nah seems fine
}

/**
 * Merge multiple array buffers into a array buffer
 * @param buffers A list of array buffers
 */
export function mergeArraybuffer(...buffers: Array<ArrayBufferLike>): ArrayBuffer
{
    const size = buffers.reduce((a,b) => a + b.byteLength,0)
    const buffer = new ArrayBuffer(size)
    let offset = 0
    for(const buf of buffers)
    {
        writeBuffer(buffer,buf,offset)
        offset += buf.byteLength 
    }
    return buffer
}

/**
 * Merge multiple array buffers into a shared array buffer
 * @param buffers A list of array buffers
 */
export function mergeSharedArrayBuffer(...buffers: Array<ArrayBufferLike>): SharedArrayBuffer
{
    const size = buffers.reduce((a,b) => a + b.byteLength,0)
    const buffer = new SharedArrayBuffer(size)
    let offset = 0
    for(const buf of buffers)
    {
        writeBuffer(buffer,buf,offset)
        offset += buf.byteLength 
    }
    return buffer
}

/**
 * Write `value` to `destination` at the provided `offset`
 * @param target The target array buffer to modify
 * @param value The value to write to the target
 * @param offset A binary offset in bytes
 */
export function writeBuffer(target: ArrayBufferLike,value: ArrayBufferLike,offset: number): void
{
    /*
        alright it works like this:

        - we create a view from the target
        - we set another view from the value to the target with an offset
        - that's it, this looks weird but it works so...
    */
    new Uint8Array(target).set(new Uint8Array(value),offset)
}

/**
 * Create a array buffer
 * @param size Size of array buffer in bytes
 */
export function createArrayBuffer(size: AnyNumber): ArrayBuffer
{
    let buffer = new ArrayBuffer
    const length = BigInt(size)
    for(let i = 0n;i < length;i++)
        mergeArraybuffer(buffer,new ArrayBuffer(1))
    return buffer
}

/**
 * Create a shared array buffer
 * @param size Size of shared array buffer in bytes
 */
export function createSharedArrayBuffer(size: AnyNumber): SharedArrayBuffer
{
    let buffer = new SharedArrayBuffer
    const length = BigInt(size)
    for(let i = 0n;i < length;i++)
        mergeSharedArrayBuffer(buffer,new SharedArrayBuffer(1))
    return buffer
}