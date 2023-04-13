export const hexToWords = (hex: Uint8Array): Array<Uint8Array> => {
  const words = [] as Array<Uint8Array>
  const bytesInAWord = 4

  for (let i = 0; i < hex.length; i += bytesInAWord) {
    const word = hex.slice(i, i + bytesInAWord)
    words.push(word)
  }

  return words
}