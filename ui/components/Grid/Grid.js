import { MOVING_DIRECTIONS } from "../../../core/constants.js"
import { getGridSize, movePlayer, subscribe, unsubscribe } from "../../../core/state-manager.js"
import { Cell } from "./Cell.js"

export function Grid() {
    console.log("GRID")
    const element = document.createElement("div")

    const localState = {
        cleanupFunctions: []
    }

    const keyupObserver = (e) => {
        console.log(e.code)
        switch (e.code) {
            case 'ArrowUp': 
                movePlayer(1, MOVING_DIRECTIONS.UP)
                break
            case 'ArrowDown': 
                movePlayer(1, MOVING_DIRECTIONS.DOWN)
                break
            case 'ArrowLeft': 
                movePlayer(1, MOVING_DIRECTIONS.LEFT)
                break
            case 'ArrowRight': 
                movePlayer(1, MOVING_DIRECTIONS.RIGHT)
                break


            case 'KeyW': 
                movePlayer(2, MOVING_DIRECTIONS.UP)
                break
            case 'KeyS': 
                movePlayer(2, MOVING_DIRECTIONS.DOWN)
                break
            case 'KeyA': 
                movePlayer(2, MOVING_DIRECTIONS.LEFT)
                break
            case 'KeyD': 
                movePlayer(2, MOVING_DIRECTIONS.RIGHT)
                break
            }
    }

    document.addEventListener('keyup', keyupObserver)

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
            document.removeEventListener('keyup', keyupObserver)
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