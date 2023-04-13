import { updateDivs } from "./updateDivs"

export const updateWordDivs = (wordDivs: HTMLDivElement[], newWords: Uint8Array[]) => {
  const _newWords = [...newWords]

  // Allow for words to be removed
  while (wordDivs.length > newWords.length) {
    const unusedDiv = wordDivs.pop()
    unusedDiv?.childNodes.forEach(node => node.textContent = '')
  }

  wordDivs.forEach((div, index) => {
    const thisWord = _newWords.at(index)
    if (thisWord === undefined || div.childElementCount !== 4) return

    const byteDivs = Array.from(div.children as HTMLCollectionOf<HTMLDivElement>)
    updateDivs(byteDivs, thisWord)
  })
}