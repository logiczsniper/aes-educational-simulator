import { hexToDivs } from "./hexToDivs"

export const wordsToDivs = (words: Uint8Array[]) => [...words].map(word => {
  const wordDiv = document.createElement('div')

  const byteDivs = hexToDivs(word)
  byteDivs.forEach(byteDiv => wordDiv.appendChild(byteDiv))

  return wordDiv
})