export const hexToDivs = (hex: Array<number> | Uint8Array) => [...hex].map((byte) => {
  const byteDiv = document.createElement('div')

  // byteDiv.textContent = formatHex(byte)
  const [firstByte, secondByte] = formatHex(byte)

  const firstByteSpan = document.createElement('span')
  firstByteSpan.textContent = firstByte
  firstByteSpan.classList.add('code')

  const secondByteSpan = document.createElement('span')
  secondByteSpan.textContent = secondByte
  secondByteSpan.classList.add('code')

  byteDiv.appendChild(firstByteSpan)
  byteDiv.appendChild(secondByteSpan)

  return byteDiv
})