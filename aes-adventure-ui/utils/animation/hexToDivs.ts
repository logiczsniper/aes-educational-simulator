export const hexToDivs = (hex: Array<number> | Uint8Array) => [...hex].map(byte => {
  const byteDiv = document.createElement('div')

  const [firstByte, secondByte] = hexToString(byte);

  [firstByte, secondByte].forEach(childByte => {
    const childByteDiv = document.createElement('div')
    childByteDiv.textContent = childByte
    childByteDiv.classList.add('code')
    byteDiv.appendChild(childByteDiv)
  })

  return byteDiv
})