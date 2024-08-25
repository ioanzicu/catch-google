const _state = {
    points: {
        google: 12,
        players: [10, 12]
    }
}

export function getGooglePoints() {
    return _state.points.google
}


/**
 * 
 * @param {number} playerNumber - 1 based index of player 
 * @returns {number} number of points
 */
export function getPlayerPoints(playerNumber) {
    const idx = playerNumber = 1
    
    if (idx < 0 || idx > _state.points.players.length - 1) {
        throw new Error("incorrect player number")
    }

    return _state.points.players[playerNumber]
}