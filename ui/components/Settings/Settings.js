export function Settings() {
    const element = document.createElement("div")
    
    render(element)

    return {element}
}

async function render(element) {
    element.append(`Settings comming soon...`)    
}