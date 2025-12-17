/**
 * Get the max allowed bits for `number`
 * @param number A number
 */
export function bitLength(number: number): number
{
    number = Math.abs(number)
    if(number === 0)
        return 0
    return Math.floor(Math.log2(number)) + 1
}

/**
 * Get the max allowed bytes for `number`
 * @param number 
 */
export function byteLength(number: number): number
{
    return Math.ceil(bitLength(number) / 8)
}

/**
 * Decompose `number` to its bits
 * @param number A number
 */
export function toBits(number: number,maxValue: number = 0b1): Array<number>
{
    const bits: Array<number> = []
    while(bitLength(number) !== 0)
    {
        const bit = number & maxValue
        bits.push(bit)
        number = number >>> bitLength(maxValue)
    }
    return bits.reverse()
}

/**
 * Decompose `number` to its bytes
 * @param number A number
 */
export function toBytes(number: number,maxValue: number = 0xff): Array<number>
{
    const bytes: Array<number> = []
    while(byteLength(number) !== 0)
    {
        const byte = number & maxValue
        bytes.push(byte)
        number = number >>> bitLength(maxValue)
    }
    return bytes.reverse()
}