import { playAgain } from '../../../core/state-manager.js'

export function Lose() {
    const element = document.createElement('div')

    render(element)

    return { element }
}

async function render(element) {
    const titleElement = document.createElement('h1')
    titleElement.append("YOU lost! Google Won!!!")

    element.append(titleElement)

    const button = document.createElement('button')
    button.append('Play Again')
    button.addEventListener('click', () => {
        playAgain()
    })

    element.append(button)
}