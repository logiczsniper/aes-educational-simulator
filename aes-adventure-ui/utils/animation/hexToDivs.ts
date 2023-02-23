import { getId } from "../getId"

export const hexToDivs = (hex: Uint8Array) => {
  const id = getId()
  const getDivIndexClass = (index: number) => `${id}-${index}`
  const getDivRowClass = (row: number) => `${id}-row-${row}`
  const getDivColumnClass = (column: number) => `${id}-column-${column}`

  const rowCount = 4
  const columnCount = hex.length / rowCount

  const byteDivs = [...hex].map((byte, index) => {
    const byteDiv = document.createElement('div')

    const row = Math.floor(index / rowCount)
    const column = index % rowCount

    byteDiv.classList.add(id, getDivIndexClass(index), getDivRowClass(row), getDivColumnClass(column))
    byteDiv.textContent = String(byte)

    return byteDiv
  })

  const getDiv = (row: number, column: number) =>
    document.getElementsByClassName(getDivIndexClass(row * columnCount + column)).item(0)
  const getDivRow = (row: number) => document.getElementsByClassName(getDivRowClass(row))
  const getDivColumn = (column: number) => document.getElementsByClassName(getDivColumnClass(column))
  const mountDivs = (root: HTMLElement) => byteDivs.forEach(byteDiv => root.appendChild(byteDiv))
  const toTarget = <T extends (..._: any[]) => any>(classFn: T) => (...params: Parameters<T>) => '.' + classFn(params)

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