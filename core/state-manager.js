const _state = {
    settings: {
        gridSize: {
            rows: 4,
            columns: 4,
        },
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
        google: 12,
        players: [3, 7]
    }
}

function _getPlayerIndexByNumber(playerNumber) {
    const idx = playerNumber - 1
    
    if (idx < 0 || idx > _state.points.players.length - 1) {
        throw new Error("incorrect player number")
    }

    return idx
}

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
