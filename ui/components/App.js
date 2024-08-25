import { Grid } from "./Grid/Grid.js";
import { ResultPanel } from "./ResultPanel/ResultPanel.js";
import { Settings } from "./Settings/Settings.js";

export function App() {
    const element = document.createElement("div")
    
    const settings = Settings()
    const resultPanel= ResultPanel()
    const grid = Grid()

    element.append(
        settings,
        resultPanel,
        grid
    )

    return element
}