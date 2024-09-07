const _state = {
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

function _notifyObservers() {
    _observers.forEach(o => {
        try{
            o();
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

let googleJumpInterval

googleJumpInterval = setInterval(() => {
    _jumpGoogleToNewPosition()
    _state.points.google++

    if (_state.points.google === _state.settings.pointsToLose) {
        clearInterval(googleJumpInterval)
    }

    _notifyObservers()
}, _state.settings.googleJumpIntervalMs)

// INTERFACE/ADAPTER
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
