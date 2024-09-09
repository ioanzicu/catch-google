import { EVENTS } from "../../../core/constants.js"
import { getGooglePosition, getPlayerPosition, subscribe, unsubscribe } from "../../../core/state-manager.js"
import { GoogleComponent } from "../common/Google/GoogleComponent.js"
import { PlayerComponent } from "../common/Player/PlayerComponent.js"

export function Cell(row, col) {
    console.log('Cell component')
    const element = document.createElement('td')
    
    const observer = (event) => {
        if (event.name !== EVENTS.GOOGLE_JUMPED) 
            return

        if (event.payload.prevCoordinates.row == row && event.payload.prevCoordinates.col == col) {
            render(element, row, col)
        }

        if (event.payload.newCoordinates.row == row && event.payload.newCoordinates.col == col) {
            render(element, row, col)
        }
    }
    
    subscribe(observer)
    
    render(element, row, col)
    
    return {
        element,
        cleanup: () => {
            console.log("CELL Cleanup", row, col)
            unsubscribe(observer)
        }
    }
}

async function render(element, row, col) {
    element.innerHTML = ''

    console.log('Cell component render', row, col)
    const googlePosition = await getGooglePosition()
    const player1Position = await getPlayerPosition(1)
    const player2Position = await getPlayerPosition(2)

    if (googlePosition.row === row && googlePosition.col === col) {
        element.append(GoogleComponent().element)
    }

    if (player1Position.row === row && player1Position.col === col) {
        element.append(PlayerComponent(1).element)
    }

    if (player2Position.row === row && player2Position.col === col) {
        element.append(PlayerComponent(2).element)
    }
}