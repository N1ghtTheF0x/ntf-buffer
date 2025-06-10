import { Buffer } from "./buffer"
import { BinaryNumberMap, BinaryNumberType } from "./types"

export type StructReaderDefinition = {
    [name: string]: StructReaderProperty
}
export type StructWriterDefinition = {
    [name: string]: StructWriterProperty
}
/**
 * Sometimes you have to write your own reader
 */
export type CustomStructReaderProperty = (buffer: Buffer) => any
/**
 * defines how a struct is structured. You can even nest defintions and it should work
 */
export type StructDefinition = StructReaderDefinition | StructWriterDefinition
export type StructWriterProperty = BinaryNumberType | StructWriterDefinition | number
export type StructReaderProperty = BinaryNumberType | StructReaderDefinition | number | CustomStructReaderProperty
/**
 * there are 4 ways to define a property:
 * - a binary type
 * - another struct defintion
 * - a function that can return anything with the buffer as the single parameter (writing is not supported)
 * - a number which coresponds to the size of a arbitary buffer
 */
export type StructProperty = StructReaderProperty | StructWriterProperty
/**
 * converts a struct property into its value
 * @template P the property to turn into a value
 */
export type StructValue<P extends StructProperty> = P extends number ? ArrayBufferLike :
                                                   (P extends BinaryNumberType ? BinaryNumberMap[P] :
                                                   (P extends CustomStructReaderProperty ? ReturnType<P> :
                                                   (P extends StructDefinition ? Struct<P> : never)))
/**
 * a struct defined by a generic `StructDefinition`
 * @template Def the definition of the struct (aka the structure of the struct)
 */
export type Struct<Def extends StructDefinition> = {
    [K in keyof Def]: StructValue<Def[K]>
}