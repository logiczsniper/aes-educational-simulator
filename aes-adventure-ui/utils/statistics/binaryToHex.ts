export const binaryToHex = (binary: Array<number>): Uint8Array => {
  const binaryStringsArray = Array.from(binary.join('').match(/.{1,8}/g) ?? [])

  return Uint8Array.from(binaryStringsArray.map(b => Number.parseInt(b, 2)))
}