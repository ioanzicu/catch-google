import { EVENTS } from "../../../core/constants.js"
import { subscribe } from "../../../core/state-manager.js"

export function AudioComponent() {
    const catchAudio = new Audio('assets/audio/catch.wav')
    const missAudio = new Audio('assets/audio/miss.mp3')

    subscribe((event)=> {
        if (event.name === EVENTS.GOOGLE_CAUGHT) {
            catchAudio.currentTime = 0
            missAudio.play()
        }
        if (event.name === EVENTS.GOOGLE_RAN_AWAY) {
            catchAudio.currentTime = 0
            catchAudio.play()
        }
    })
}