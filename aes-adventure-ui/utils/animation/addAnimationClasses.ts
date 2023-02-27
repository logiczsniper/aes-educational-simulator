import { getId } from "../getId"

export const addAnimationClasses = (divs: Array<HTMLDivElement>) => {
  const rowCount = 4

  const id = getId()
  const getDivIndexClass = (index: number) => `${id}-${index}`
  const getDivRowClass = (row: number) => `${id}-row-${row}`
  const getDivColumnClass = (column: number) => `${id}-column-${column}`

  const targetDivs = divs.map((div, index) => {
    const row = Math.floor(index / rowCount)
    const column = index % rowCount

    const targetDiv = div.cloneNode(true) as HTMLDivElement
    targetDiv.classList.add(id, getDivIndexClass(index), getDivRowClass(row), getDivColumnClass(column))

    return targetDiv
  })

  return {
    id,
    targetDivs,
    targetAllClass: `.${id}`,
    targetIndexClass: (index: number) => `.${getDivIndexClass(index)}`,
    targetRowClass: (row: number) => `.${getDivRowClass(row)}`,
    targetColumnClass: (column: number) => `.${getDivColumnClass(column)}`,
    targetCoordsClass: (row: number, column: number) => `.${getDivRowClass(row)}.${getDivColumnClass(column)}`
  }
}