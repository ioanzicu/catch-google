import { EVENTS, GAME_STATUSES } from "./constants.js"

const _state = {
    gameStatus: GAME_STATUSES.SETTINGS,
    settings: {
        gridSize: {
            rows: 4,
            columns: 4,
        },
        googleJumpIntervalMs: 3000,
        pointsToLose: 5, 
        pointsToWin: 5,
    },
    positions: {
        google: {
            row: 1, 
            col: 1,
        },
        players: [
            {
                row: 1, 
                col: 0,
            },
            {
                row: 3, 
                col: 2,
            },
        ]
    },
    points: {
        google: 0,
        players: [0, 0]
    }
}

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

function _getPlayerIndexByNumber(playerNumber) {
    const idx = playerNumber - 1
    
    if (idx < 0 || idx > _state.points.players.length - 1) {
        throw new Error("incorrect player number")
    }

    return idx
}

function _generateNewNumber(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function _jumpGoogleToNewPosition(){
    const newPosition = {
        ..._state.positions.google
    }

    do {
        newPosition.row = _generateNewNumber(0, _state.settings.gridSize.rows-1)
        newPosition.col = _generateNewNumber(0, _state.settings.gridSize.columns-1)

        console.log('newPosition', newPosition )
        var isNewPositionMatchWithCurrentGooglePosition = newPosition.row === _state.positions.google.row && newPosition.col === _state.positions.google.col
        var isNewPositionMatchWithCurrentPlayer1Position = newPosition.row === _state.positions.players[0].row && newPosition.col === _state.positions.players[0].col
        var isNewPositionMatchWithCurrentPlayer2Position = newPosition.row === _state.positions.players[1].row && newPosition.col === _state.positions.players[1].col
    } while(isNewPositionMatchWithCurrentGooglePosition || isNewPositionMatchWithCurrentPlayer1Position || isNewPositionMatchWithCurrentPlayer2Position)

    _state.positions.google = newPosition
}

// INTERFACE/ADAPTER
export async function getGooglePoints() {
    return _state.points.google
}

let googleJumpInterval

export async function start() {
    if (_state.gameStatus !== GAME_STATUSES.SETTINGS) {
        throw new Error(`Incorrect transition from "${_state.gameStatus}" to ${GAME_STATUSES.IN_PROGRESS}`)
    }

    _state.gameStatus = GAME_STATUSES.IN_PROGRESS
    _state.positions.players[0] = {
        row: 0,
        col: 0,
    }
    _state.positions.players[1] = {
        row: _state.settings.gridSize.columns - 1,
        col: _state.settings.gridSize.rows - 1,
    }
    _jumpGoogleToNewPosition()

    _state.points.google = 0
    _state.points.players = [0, 0]

    googleJumpInterval = setInterval(() => {
        const prevCoordinates = { ..._state.positions.google }
        _jumpGoogleToNewPosition()
        _notifyObservers(EVENTS.GOOGLE_JUMPED, {
            prevCoordinates,
            newCoordinates: {
                ..._state.positions.google
            }
        })
        
        _state.points.google++
        _notifyObservers(EVENTS.SCORES_CHANGED)
    
        if (_state.points.google === _state.settings.pointsToLose) {
            clearInterval(googleJumpInterval)
            _state.gameStatus = GAME_STATUSES.LOSE
        }
        _notifyObservers(EVENTS.STATUS_CHANGED)
    }, _state.settings.googleJumpIntervalMs)

    _notifyObservers(EVENTS.STATUS_CHANGED)
}

export async function playAgain() {
    _state.gameStatus = GAME_STATUSES.SETTINGS
    _notifyObservers(EVENTS.STATUS_CHANGED)
}

/**
 * 
 * @param {number} playerNumber - 1 based index of player 
 * @returns {Promise<number>} number of points
 */
export async function getPlayerPoints(playerNumber) {
    const idx = _getPlayerIndexByNumber(playerNumber)
    return _state.points.players[idx]
}

export async function getGameStatus(playerNumber) {
    return _state.gameStatus
}

export async function getGridSize() {
    // copy of setting, to not allow mutability
    return {..._state.settings.gridSize}
}

export async function getGooglePosition() {
    return {..._state.positions.google}
}

export async function getPlayerPosition(playerNumber) {
    const idx = _getPlayerIndexByNumber(playerNumber)
    return {..._state.positions.players[idx]}
}
