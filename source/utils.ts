import { AnyNumber } from "./types"

/**
 * basic clamp function, nothing special
 * @param value the value to clamp
 * @param min the value to return if `value` is smaller than this
 * @param max the value to return if `value` is bigger than this
 * @returns either `value`, `min` or `max`
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
 * merge multiply array buffers into one
 * @param buffers array of array buffers
 * @returns one single array buffer from all the array buffers in the array
 */
export function mergeArraybuffer(...buffers: Array<ArrayBufferLike>): ArrayBuffer
{
    // calculate the size of the resulting buffer
    const size = buffers.reduce((a,b) => a + b.byteLength,0)
    const buffer = new ArrayBuffer(size) // make that buffer
    let offset = 0 // let's keep track of the offset
    for(const buf of buffers)
    {
        // idk why this even works but that's ok 👍
        new Uint8Array(buffer).set(new Uint8Array(buf),offset)
        offset += buf.byteLength // let's continue on
    }
    return buffer // gimme that shit
}

/**
 * writes the array buffer `value` to array buffer `destination` with an `offset`
 * @param target the target array buffer to modify
 * @param value the value to write to the target
 * @param offset some offset
 */
export function writeBuffer(target: ArrayBufferLike,value: ArrayBufferLike,offset: number): void
{
    /*
        alright it works like this:

        - we create a view from the target (the Uint8Array thingy)
        - we set another view from the value to the target (the other Uint8Array thingy) with an offset
        - that's it, this looks weird but it works so...
    */
    new Uint8Array(target).set(new Uint8Array(value),offset)
}