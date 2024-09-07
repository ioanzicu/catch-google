import { App } from "./components/App.js";
import { subscribe, unsubscribe } from "./../core/state-manager.js";

const rootElement = document.getElementById('root')

function renderApp() {
    rootElement.innerHTML = '';

    const appComponent = App()

    rootElement.append(appComponent.element)
}

renderApp()

subscribe(renderApp)
// unsubscribe(renderApp)