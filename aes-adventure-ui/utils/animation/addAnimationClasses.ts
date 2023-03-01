export const addAnimationClasses = (divs: Array<HTMLDivElement>, id: string, rowCount = 4) => {
  const getDivIndexClass = (index: number) => `${id}-${index}`
  const getDivRowClass = (row: number) => `${id}-row-${row}`
  const getDivColumnClass = (column: number) => `${id}-column-${column}`
  const getSpanClass = (row: number, column: number, child: 1 | 2) => `${id}-row-${row}-column-${column}-span-${child}`

  const targetDivs = divs.map((div, index) => {
    const row = Math.floor(index / rowCount)
    const column = index % rowCount

    const targetDiv = div.cloneNode(true) as HTMLDivElement
    targetDiv.classList.add(id, getDivIndexClass(index), getDivRowClass(row), getDivColumnClass(column))

    const [firstByteSpan, secondByteSpan] = targetDiv.children
    firstByteSpan.classList.add(getSpanClass(row, column, 1))
    secondByteSpan.classList.add(getSpanClass(row, column, 2))

    return targetDiv
  })

  return {
    id,
    targetDivs,
    targetAllClass: `.${id}`,
    targetIndexClass: (index: number) => `.${getDivIndexClass(index)}`,
    targetRowClass: (row: number) => `.${getDivRowClass(row)}`,
    targetColumnClass: (column: number) => `.${getDivColumnClass(column)}`,
    targetCoordsClass: (row: number, column: number) => `.${getDivRowClass(row)}.${getDivColumnClass(column)}`,
    targetSpanClass: (row: number, column: number, child: 1 | 2) => `.${getSpanClass(row, column, child)}`
  }
}