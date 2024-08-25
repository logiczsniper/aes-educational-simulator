export const hexToBinary = (hex: Uint8Array): Array<number> => {
  const binaryCharacterArray = Array.from(hex).flatMap(h => h.toString(2).padStart(8, '0').split(''))

  return binaryCharacterArray.map(c => Number.parseInt(c))
}