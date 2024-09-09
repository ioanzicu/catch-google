import { getGridSize, subscribe, unsubscribe } from "../../../core/state-manager.js"
import { Cell } from "./Cell.js"

export function Grid() {
    console.log("GRID")
    const element = document.createElement("div")

    const localState = {
        cleanupFunctions: []
    }

    element.classList.add('grid')

    // const observer = () => {
    //     render(element)
    // }
    // subscribe(observer)

    render(element, localState)

    return {
        element, 
        cleanup: () => {
            localState.cleanupFunctions.forEach((cleanupFn) => cleanupFn())
        }
    }
}

async function render(element, localState) {
    console.log('GRID RERENDER')

    localState.cleanupFunctions.forEach(cleanupFn => cleanupFn())
    localState.cleanupFunctions = []

    element.innerHTML = ''
    
    const { rows, columns } = await getGridSize()
    for (let row = 0; row < rows; row++) {
        const rowElement = document.createElement('tr')

        for (let col = 0; col < columns; col++) {
            const cellComponent = Cell(row, col)
            localState.cleanupFunctions.push(cellComponent.cleanup)
            rowElement.append(cellComponent.element)
        }
        
        element.append(rowElement)
    }
    console.log('GRID FINISH RENDER')
}