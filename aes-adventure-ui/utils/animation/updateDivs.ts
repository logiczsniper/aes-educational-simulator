export const updateDivs = (divs: HTMLDivElement[], newHex: Array<number> | Uint8Array) => {
  const _newHex = [...newHex]

  divs.forEach((div, index) => {
    const thisByte = _newHex.at(index)
    if (thisByte === undefined || div.childElementCount !== 2) return

    const [firstNibble, secondNibble] = hexToString(thisByte);

    if (div.firstChild) div.firstChild.textContent = firstNibble
    if (div.lastChild) div.lastChild.textContent = secondNibble
  })
}