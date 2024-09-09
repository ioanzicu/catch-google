import { getGridSize, subscribe, unsubscribe } from "../../../core/state-manager.js"
import { Cell } from "./Cell.js"

export function Grid() {
    const element = document.createElement("div")
    element.classList.add('grid')

    const observer = () => {
        render(element)
    }
    subscribe(observer)

    render(element)

    return {
        element, 
        cleanup: () => unsubscribe(observer)
    }
}

async function render(element) {
    element.innerHTML = ''
    
    const {rows, columns} = await getGridSize()
    for (let row = 0; row < rows; row++) {
        const rowElement = document.createElement('tr')

        for (let col = 0; col < columns; col++) {
            const cellComponent = Cell(row, col)
            rowElement.append(cellComponent.element)
        }
        
        element.append(rowElement)
    }
}