import { Grid } from "./Grid/Grid.js";
import { ResultPanel } from "./ResultPanel/ResultPanel.js";
import { Settings } from "./Settings/Settings.js";
import { Lose } from "./Loose/Loose.js";
import { Start } from "./Start.js";
import { getGameStatus } from "../../core/state-manager.js";
import { GAME_STATUSES } from "../../core/constants.js";

export function App() {
    const element = document.createElement("div")
    
    render(element)

    return {element}
}

async function render(element) {
    
    const gameStatus = await getGameStatus()

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
            const gridComponent = Grid()
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