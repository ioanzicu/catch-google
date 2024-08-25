import { Grid } from "./Grid/Grid.js";
import { ResultPanel } from "./ResultPanel/ResultPanel.js";
import { Settings } from "./Settings/Settings.js";

export function App() {
    const element = document.createElement("div")
    
    render(element)

    return {element}
}

async function render(element) {
    const settingsComponent = Settings()
    const resultPanelComponent= ResultPanel()
    const gridComponent = Grid()

    element.append(
        settingsComponent.element,
        resultPanelComponent.element,
        gridComponent.element
    )    
}