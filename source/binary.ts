import { IReader } from "./reader"
import { Endianness } from "./types"
import { IWriter } from "./writer"

/**
 * A object that can read and write binary data
 */
export interface IBinaryData extends IReader, IWriter
{
    /**
     * The byte order, only `"little"` and `"big"` are accepted
     */
    endianness: Endianness
    /**
     * Set the byte order
     * @param endianness A valid byte order
     */
    setEndianness(endianness: Endianness): this
}