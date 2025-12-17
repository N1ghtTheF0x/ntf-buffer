import { IReader } from "./reader"
import { BinaryNumberMap, BinaryNumberType } from "./types"

/**
 * A object that contains the layout of a struct for reading
 */
export type StructReaderDefinition = {
    [name: string]: StructReaderProperty
}
/**
 * A object that contains the layout of a struct for writing
 */
export type StructWriterDefinition = {
    [name: string]: StructWriterProperty
}
/**
 * A function for reading any kind of data
 */
export type CustomStructReaderProperty = (region: IReader) => any
/**
 * A function for writing any kind of data
 */
export type CustomStructWriterProperty = (value: unknown) => ArrayBufferLike
/**
 * Defines the layout of a struct. You can even nest this type within itself
 */
export type StructDefinition = StructReaderDefinition | StructWriterDefinition
/**
 * A property that is used for writing structs
 */
export type StructWriterProperty = BinaryNumberType | StructWriterDefinition | number
/**
 * A property that is used for reading structs
 */
export type StructReaderProperty = BinaryNumberType | StructReaderDefinition | number | CustomStructReaderProperty
/**
 * There are 4 ways to define a property:
 * - A binary type
 * - Another struct defintion
 * - A function that can return anything with the buffer as the single parameter (writing is not supported)
 * - A number which coresponds to the size of a arbitary array buffer
 */
export type StructProperty = StructReaderProperty | StructWriterProperty
/**
 * Converts a struct property into its value
 * @template P The property to turn into a value
 */
export type StructValue<P extends StructProperty> = P extends number ? ArrayBufferLike :
                                                   (P extends BinaryNumberType ? BinaryNumberMap[P] :
                                                   (P extends CustomStructReaderProperty ? ReturnType<P> :
                                                   (P extends StructDefinition ? Struct<P> : never)))
/**
 * A typed struct from a struct definition
 * @template D The layout of the struct
 */
export type Struct<D extends StructDefinition> = {
    [K in keyof D]: StructValue<D[K]>
}