export const addAnimationClasses = (divs: Array<HTMLDivElement>, id: string, rowCount = 4) => {
  const getDivIndexClass = (index: number) => `${id}-${index}`
  const getDivRowClass = (row: number) => `${id}-row-${row}`
  const getDivColumnClass = (column: number) => `${id}-column-${column}`
  const getChildClass = (row: number, column: number, child: number) => `${id}-row-${row}-column-${column}-child-${child}`
  const getGrandChildClass = (row: number, column: number, child: number, grandChild: number) => `${id}-row-${row}-column-${column}-child-${child}-grandChild-${grandChild}`

  const targetDivs = divs.map((div, index) => {
    const row = Math.floor(index / rowCount)
    const column = index % rowCount

    const targetDiv = div.cloneNode(true) as HTMLDivElement
    targetDiv.classList.add(id, getDivIndexClass(index), getDivRowClass(row), getDivColumnClass(column))

    for (let i = 1; i <= targetDiv.children.length; i++) {
      const child = targetDiv.children.item(i - 1)
      if (!child) continue;

      child.classList.add(getChildClass(row, column, i))

      for (let j = 1; j <= child.children.length; j++) {
        const grandChild = child.children.item(j - 1)
        if (!grandChild) continue;

        grandChild.classList.add(getGrandChildClass(row, column, i, j))
      }
    }

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
    targetChildClass: (row: number, column: number, child: number) => `.${getChildClass(row, column, child)}`,
    targetGrandChildClass: (row: number, column: number, child: number, grandChild: number) => `.${getGrandChildClass(row, column, child, grandChild)}`
  }
}
