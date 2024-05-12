import { Buffer } from "./buffer"
import { BinaryNumberType } from "./types"

/**
 * defines how a struct is structured. You can even nest defintions and it should work
 */
export type StructDefinition = {
    [name: string]: StructProperty
}
/**
 * there are 4 ways to define a property:
 * - a binary type
 * - another struct defintion
 * - a function that can return anything with the buffer as the single parameter
 * - a number which coresponds to the size of a arbitary buffer
 */
export type StructProperty = BinaryNumberType | StructDefinition | CustomStructProperty | number
/**
 * Sometimes you have to write your own reader
 */
export type CustomStructProperty = (buffer: Buffer) => any