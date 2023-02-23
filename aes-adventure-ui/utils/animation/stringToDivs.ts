import { getId } from "../getId"

export const stringToDivs = (s: string) => {
  const id = getId()
  const getDivIndexClass = (index: number) => `${id}-${index}`
  const getDivRowClass = (row: number) => `${id}-row-${row}`
  const getDivColumnClass = (column: number) => `${id}-column-${column}`

  const bytes = (s.match(/.{1,2}/g) ?? []) as Array<string>

  const rowCount = 4
  const columnCount = bytes.length / rowCount

  const byteDivs = bytes.map((byte, index) => {
    const byteDiv = document.createElement('div')

    const row = Math.floor(index / rowCount)
    const column = index % rowCount

    byteDiv.classList.add(id, getDivIndexClass(index), getDivRowClass(row), getDivColumnClass(column))
    byteDiv.textContent = byte

    return byteDiv
  })

  const getDiv = (row: number, column: number) => {
    return document.getElementsByClassName(getDivIndexClass(row * columnCount + column)).item(0)
    // return byteDivs[row * columnCount + column]
    // return byteDivs.find(byteDiv => byteDiv.classList.contains(getDivIndexClass(row * columnCount + column)))
  }

  const getDivRow = (row: number) => {
    return document.getElementsByClassName(getDivRowClass(row))
  }

  const getDivColumn = (column: number) => {
    return document.getElementsByClassName(getDivColumnClass(column))
  }

  const mountDivs = (root: HTMLElement) => {
    byteDivs.forEach(byteDiv => root.appendChild(byteDiv))
  }

  const toTarget = <T extends (..._: any[]) => any>(classFn: T) => (...params: Parameters<T>) => {
    return '.' + classFn(params)
  }

  return {
    mountDivs,
    getDiv,
    getDivRow,
    getDivColumn,
    getDivIndexClass: toTarget(getDivIndexClass),
    getDivRowClass: toTarget(getDivRowClass),
    getDivColumnClass: toTarget(getDivColumnClass),
    id,
    byteDivs,
  }
}