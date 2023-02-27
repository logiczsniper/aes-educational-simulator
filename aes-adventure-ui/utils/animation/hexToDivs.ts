export const hexToDivs = (hex: Array<number> | Uint8Array) => [...hex].map((byte) => {
  const byteDiv = document.createElement('div')

  byteDiv.classList.add('code')
  byteDiv.textContent = formatHex(byte)

  return byteDiv
})