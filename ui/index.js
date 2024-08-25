import { App } from "./components/App.js";

const rootElement = document.getElementById('root')

rootElement.innerHTML = '';


const app = App()

rootElement.append(app)