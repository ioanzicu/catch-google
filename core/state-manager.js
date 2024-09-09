import { EVENTS, GAME_STATUSES, MOVING_DIRECTIONS } from "./constants.js"

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
    } while(
        _checkPlayer1Position(newPosition) ||
        _checkPlayer2Position(newPosition) || 
        _checkGooglePosition(newPosition))

    _state.positions.google = newPosition
}

function _checkRange(position) {
    if (position.row < 0 || position.row >= _state.settings.gridSize.rows) {
        return false
    }

    if (position.col < 0 || position.col >= _state.settings.gridSize.columns) {
        return false
    }

    return true
}

function _checkPlayer1Position(position) {
    return position.row === _state.positions.players[0].row && position.col === _state.positions.players[0].col
}

function _checkPlayer2Position(position) {
    return position.row === _state.positions.players[1].row && position.col === _state.positions.players[1].col
}

function _checkGooglePosition(position) {
    return position.row === _state.positions.google.row && position.col === _state.positions.google.col
}

function _catchGoogle(playerNumber) {
    const idx = _getPlayerIndexByNumber(playerNumber)

    _state.points.players[idx]++
    _notifyObservers(EVENTS.SCORES_CHANGED)

    if ( _state.points.players[idx] === _state.settings.pointsToWin) {
        // won
        _state.gameStatus = GAME_STATUSES.WIN
        _notifyObservers(EVENTS.STATUS_CHANGED)
        clearInterval(googleJumpInterval)
    } else {
        const prevCoordinates = _state.positions.google
        _jumpGoogleToNewPosition()
        _notifyObservers(
            EVENTS.GOOGLE_JUMPED,
            {
                prevCoordinates, 
                newCoordinates: _state.positions.google,
            }
        )    
    }
}
 
// INTERFACE/ADAPTER

// COMMANDS / SETTER
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

export async function movePlayer(playerNumber, direction) {
    if (_state.gameStatus !== GAME_STATUSES.IN_PROGRESS) {
        console.warn('You can move player only when game is in progress')
        return
    }
     
    const idx = _getPlayerIndexByNumber(playerNumber)
    const prevCoordinates = {..._state.positions.players[idx]}
    const newCoordinates = {..._state.positions.players[idx]}

    switch (direction) {
        case MOVING_DIRECTIONS.UP:
            newCoordinates.row--
            break
        case MOVING_DIRECTIONS.DOWN:
            newCoordinates.row++
            break
        case MOVING_DIRECTIONS.RIGHT:
            newCoordinates.col++
            break
        case MOVING_DIRECTIONS.LEFT:
            newCoordinates.col--
            break
    }

    const isValidRange = _checkRange(newCoordinates)
    if (!isValidRange)
        return

    const matchPlayer1Position = _checkPlayer1Position(newCoordinates)
    if (matchPlayer1Position)
        return
    
    const matchPlayer2Position = _checkPlayer2Position(newCoordinates)
    if (matchPlayer2Position)
        return
    
    const isGooglePositionTheSame = _checkGooglePosition(newCoordinates)
    if (isGooglePositionTheSame) {
        _catchGoogle(playerNumber)
    }

    _state.positions.players[idx] = newCoordinates
    _notifyObservers(
        EVENTS[`PLAYER${playerNumber}_MOVED`], 
        {
            prevCoordinates,
            newCoordinates,
        }
    )
}

// GETTERS / SELECTORS / QUERY
export async function getGooglePoints() {
    return _state.points.google
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
