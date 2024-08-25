import { getGooglePoints, getPlayerPoints } from "../../../core/state-manager.js"

export function ResultPanel() {
    const element = document.createElement("div")

    const googlePoints = getGooglePoints()
    const player1Points = getPlayerPoints(0)
    const player2Points = getPlayerPoints(0)

    element.append(`Player1: ${player1Points}, Player2: ${player2Points}, Google: ${googlePoints}`)

    return element
}