export const groupHex = (hex: Uint8Array, bytesPerGroup: number): Array<Uint8Array> => {
  const groups = [] as Array<Uint8Array>

  for (let i = 0; i < hex.length; i += bytesPerGroup) {
    const word = hex.slice(i, i + bytesPerGroup)
    groups.push(word)
  }

  return groups
}