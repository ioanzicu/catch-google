export function Cell(row, col) {
    const element = document.createElement('td')
    render(element, row, col)
    return {element}
}

async function render(element, row, col) {
    element.append(`${row} ${col}`)
}