import { getGooglePosition, getPlayerPosition } from "../../../core/state-manager.js"
import { GoogleComponent } from "../common/Google/GoogleComponent.js"
import { PlayerComponent } from "../common/Player/PlayerComponent.js"


export function Cell(row, col) {
    const element = document.createElement('td')
    render(element, row, col)
    return {element}
}

async function render(element, row, col) {

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