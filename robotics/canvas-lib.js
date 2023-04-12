"use strict";

const CONTEXT_TYPE = "2d"

class CanvasLib {

    constructor(
        canvasId,
        loopFunction,
        backgroundColor = "#FFFFFF"
    ) {
        this.canvasElement = document.getElementById(canvasId)
        this.canvasContext = this.canvasElement.getContext(CONTEXT_TYPE)
        this.loopFunction = loopFunction
        this.backgroundColor = backgroundColor
    }

    start() {
        this.lastTime = new Date().getTime()
        window.requestAnimationFrame(this.loop.bind(this))
    }

    loop(timestamp) {
        this.canvasContext.fillStyle = "white"
        this.canvasContext.fillRect(0, 0, 800, 600)
        
        let currentTime = new Date().getTime()
        let delta = currentTime - this.lastTime
        this.lastTime = currentTime
        this.loopFunction(delta, this.canvasContext)

        window.requestAnimationFrame(this.loop.bind(this))
    }
}
