import { Grid } from "./Grid/Grid.js";
import { ResultPanel } from "./ResultPanel/ResultPanel.js";
import { Settings } from "./Settings/Settings.js";
import { Lose } from "./Loose/Loose.js";
import { Start } from "./Start.js";
import { getGameStatus, subscribe } from "../../core/state-manager.js";
import { GAME_STATUSES } from "../../core/constants.js";

export function App() {
    const localState = { 
        prevGameStatus: null,
        cleanupFunctions: [],
    }
    console.log('APP CREATING')
    const element = document.createElement("div")
    
    subscribe(() => {
        render(element, localState)
    })

    render(element, localState)

    return { element }
}

async function render(element, localState) {
    const gameStatus = await getGameStatus()

    if (localState.prevGameStatus === gameStatus)
        return

    localState.prevGameStatus = gameStatus

    console.log('APP RENDERING')
    localState.cleanupFunctions.forEach(cleanupFn => cleanupFn())
    localState.cleanupFunctions = []

    element.innerHTML = ''
    
    switch (gameStatus) {
        case GAME_STATUSES.SETTINGS: {
            const settingsComponent = Settings()
            const startComponent = Start()
            element.append(settingsComponent.element, startComponent.element)
            break
        }
        case GAME_STATUSES.IN_PROGRESS:
            const settingsComponent = Settings()
            const resultPanelComponent= ResultPanel()
            localState.cleanupFunctions.push(resultPanelComponent.cleanup)

            const gridComponent = Grid()
            localState.cleanupFunctions.push(gridComponent.cleanup)
            
            element.append(
                settingsComponent.element,
                resultPanelComponent.element,
                gridComponent.element
            )            
            break
        case GAME_STATUSES.LOSE:
            const loseComponent = Lose()
            element.append(loseComponent.element)
            break
        default:
            throw new Error('not implemented')
    }
}