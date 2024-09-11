import express from 'express'
import cors from 'cors'
import {
    start, 
    getGameStatus, 
    getGooglePosition,
    playAgain, 
    getGridSize, 
    getGooglePoints, 
    movePlayer, 
    getPlayerPoints,
    getPlayerPosition
} from '../core/state-manager-server.js'

const app = express()
app.use(cors())

const port = 3000

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
})

app.get('/start', async (req, res) => {
    await start()
    res.send(200)
})

app.get('/playagain', async (req, res) => {
    await playAgain()
    res.send(200)
})

app.get('/moveplayer', async (req, res) => {
    await movePlayer(req.query.playerNumber, req.query.direction)
    res.send(200)
})

app.get('/gamestatus', async (req, res) => {
    const gameStatus = await getGameStatus()
    res.send({ data: gameStatus })
})

app.get('/googlepoints', async (req, res) => {
    const googlePoints = await getGooglePoints()
    res.send({ data: googlePoints })
})

app.get('/googleposition', async (req, res) => {
    const googlePosition = await getGooglePosition()
    res.send({ data: googlePosition })
})

app.get('/playerpoints', async (req, res) => {
    const playerPoints = await getPlayerPoints(req.query.playerNumber)
    res.send({ data: playerPoints })
})

app.get('/playerposition', async (req, res) => {
    const playerPosition = await getPlayerPosition(req.query.playerNumber)
    res.send({ data: playerPosition })
})

app.get('/gridsize', async (req, res) => {
    const gridSize = await getGridSize()
    res.send({ data: gridSize })
})


app.listen(port, () => {
    console.log('App listening at port:', port)
})