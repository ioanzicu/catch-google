export function Grid() {
    const element = document.createElement("div")
    
    render(element)

    return {element}
}

async function render(element) {
    element.append(`Grid comming soon...`)    
}