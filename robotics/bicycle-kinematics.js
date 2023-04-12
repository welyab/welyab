"use strict";

class PathPoint {
    constructor(rectangle, time) {
        this.rectangle = rectangle
        this.time = time
    }
}

class BicycleKinematics {

    constructor() {
        this.path = []
        this.bicycle = new Rectangle({
            position: new Point(400, 400),
            width: 200.0,
            height: 80.0,
            xShift: -40,
            yShift: -40,
            angle: -0,
            paintPosition: false,
            subElements: [
                this.roda1 = new Rectangle({
                    position: new Point(0, 0),
                    width: 50.0,
                    height: 20.0,
                    xShift: -25,
                    yShift: -10,
                    angle: -0,
                    shapeColor: "black",
                    paintPosition: false
                }),
                this.roda2 = new Rectangle({
                    position: new Point(120, 0),
                    width: 50.0,
                    height: 20.0,
                    xShift: -25,
                    yShift: -10,
                    angle: 45,
                    shapeColor: "black",
                    paintPosition: false,
                    /*subElements: [
                        new Rectangle({
                            position: new Point(0, 0),
                            width: 10.0,
                            height: 120.0,
                            xShift: -5,
                            yShift: -30,
                            angle: -0,
                            shapeColor: "yellow",
                            paintPosition: true
                        })
                    ]*/
                })
            ]
        })
    }

    update(delta, paintContext) {
        this.updateValues(delta)
        this.paintGraphicElements(paintContext)
    }

    updateValues(delta) {
        
        let velocity = 40 * (1/1000.0) // pixels / milissegundo
        let x_dot = velocity * Math.cos(toRadians(-this.bicycle.properties.angle))
        let y_dot = velocity * Math.sin(toRadians(-this.bicycle.properties.angle))
        let theta_dot = (velocity / this.roda1.getWorldPosition().distance(this.roda2.getWorldPosition()))
                        * Math.tan(toRadians(this.roda2.properties.angle))
        this.bicycle.properties.position.x += (x_dot * delta)
        this.bicycle.properties.position.y += (y_dot * delta)
        this.bicycle.properties.angle += (toDegrees(theta_dot) * delta)

        this.addPath(this.bicycle.getWorldPosition())
        
    }

    createPathRectable(point) {
        return new Rectangle({
            position: point,
            width: 6.0,
            height: 6.0,
            xShift: -3,
            yShift: -3,
            shapeColor: "red",
            paintPosition: false
        })
    }

    addPath(point) {
        if(this.path.length <= 0) {
            this.path[0] = new PathPoint(this.createPathRectable(point), new Date())
            return
        }
        if((new Date().getTime()) - this.path[this.path.length - 1].time.getTime() < 400) {
            return
        }
        if(this.path.length > 50) {
            let path = []
            for(let i = 1; i < this.path.length; i++) {
                path[i - 1] = this.path[i]
            }
            this.path = path
        }
        this.path[this.path.length] = new PathPoint(this.createPathRectable(point), new Date())
    }

    paintGraphicElements(paintContext) {
        this.bicycle.paint(paintContext)
        for(let i = 0; i < this.path.length; i++) {
            this.path[i].rectangle.paint(paintContext)
        }
    }
}
