// import { EVENTS, GAME_STATUSES, MOVING_DIRECTIONS } from "./constants.js"

// OBSERVER
let _observers = []
export function subscribe(observer) {
    _observers.push(observer)
}

export function unsubscribe(observer) {
    _observers = _observers.filter(o => o != observer)
}

function _notifyObservers(name, payload = {}) {
    const event = {
        name, 
        payload,
    }

    _observers.forEach(o => {
        try{
            o(event);
        } catch(error) {
            console.log("Error: ", error)
        }
    })
}
 
// INTERFACE/ADAPTER

// COMMANDS / SETTER
let googleJumpInterval

export async function start() {
    fetch('http://localhost:3000/start')
}

export async function playAgain() {
    fetch('http://localhost:3000/playagain')
}

export async function movePlayer(playerNumber, direction) {
    const response = await fetch(`http://localhost:3000/moveplayer?playerNumber=${playerNumber}&direction=${direction}`)
    const obj = await response.json()
    return obj.data    
}

// GETTERS / SELECTORS / QUERY
export async function getGooglePoints() {
    const response = await fetch('http://localhost:3000/googlepoints')
    const obj = await response.json()
    return obj.data
}

/**
 * 
 * @param {number} playerNumber - 1 based index of player 
 * @returns {Promise<number>} number of points
 */
export async function getPlayerPoints(playerNumber) {
    const response = await fetch('http://localhost:3000/playerpoints?playerNumber='+playerNumber)
    const obj = await response.json()
    return obj.data
}

export async function getGameStatus() {
    const response = await fetch('http://localhost:3000/gamestatus')
    const obj = await response.json()
    return obj.data
}

export async function getGridSize() {
    const response = await fetch('http://localhost:3000/gridsize')
    const obj = await response.json()
    return obj.data
}

export async function getGooglePosition() {
    const response = await fetch('http://localhost:3000/googleposition')
    const obj = await response.json()
    return obj.data
}

export async function getPlayerPosition(playerNumber) {
    const response = await fetch('http://localhost:3000/playerposition?playerNumber='+playerNumber)
    const obj = await response.json()
    return obj.data
}
