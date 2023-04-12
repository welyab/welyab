
class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    copy() {
        return new Point(this.x, this.y)
    }

    toMatrix() {
        return new Matrix(
            3, 1,
            [
                [this.x],
                [this.y],
                [1]
            ]
        )
    }

    distance(other) {
        return Math.sqrt(
            Math.pow(this.x - other.x, 2.0)
            + Math.pow(this.y - other.y, 2.0)
        )
    }
}

/* 
position: Point - the current position of the shape. This position is related to shape`s parent
xShift: number - amount of pixels that shape should be moved related to position om X axis
yShift: number - amount of pixels that shape should be moved related to position om Y axis
angle: the tilt angle of shape, in dgrees
paintPosition: Boolean - indicates if the shape`s position should be painted
positionColor: String - indicates the color of the position point
shapePoints: array of Points - the list of points of the shape
shapeColor: String - indicates the fill color of the shape
paintBorder: Boolean - indicates if border should be painted
borderColor: String - indicates the color of the border
subElements: array of GeometricShape

*/
class GeometricShape {

    constructor(properties) {
        this.properties = properties
        
        if(this.properties.position === undefined) this.position = new Point(0, 0)
        if(this.properties.xShift === undefined) this.properties.xShift = 0.0
        if(this.properties.yShift === undefined) this.properties.yShift = 0.0
        if(this.properties.angle === undefined) this.properties.angle = 0.0
        if(this.properties.shapePoints === undefined) this.properties.shapePoints = []
        if(this.properties.paintPosition === undefined) this.properties.paintPosition = true
        if(this.properties.positionColor === undefined) this.properties.positionColor = "red"
        if(this.properties.shapeColor === undefined) this.properties.shapeColor = "gray"
        if(this.properties.paintBorder === undefined) this.properties.paintBorder = true
        if(this.properties.borderColor === undefined) this.properties.borderColor = "black"
        if(this.properties.subElements === undefined) this.properties.subElements = []

        for(let i = 0; i < this.properties.subElements.length; i++) {
            this.properties.subElements[i].properties.parent = this
        }
    }

    createRotationMatrix(degrees) {
        let angle = toRadians(degrees)
        return new Matrix(
            3, 3,
            [
                [Math.cos(angle), Math.sin(angle), 0],
                [-Math.sin(angle), Math.cos(angle), 0],
                [0, 0, 1]
            ]
        )
    }

    createTranslationMatrix(deltaX, deltaY) {
        return new Matrix(
            3, 3,
            [
                [1, 0, deltaX],
                [0, 1, deltaY],
                [0, 0, 1]
            ]
        )
    }

    transformPoint(point, referencePoint, angle) {
        let result = point.toMatrix()
        result = this.createTranslationMatrix(referencePoint.x, referencePoint.y).multiply(
            this.createRotationMatrix(angle).multiply(
                this.createTranslationMatrix(-referencePoint.x, -referencePoint.y).multiply(result)
            )
        )
        point.x = result.content[0][0]
        point.y = result.content[1][0]
    }

    transformPoints(points, referencePoint, angle) {
        for(let i = 0; i < points.length; i++) {
            let point = points[i]
            this.transformPoint(point, referencePoint, angle)
        }
    }

    getWorldPosition() {
        let position = this.properties.position.copy()
        if(this.properties.parent) {
            let parentPosition = this.properties.parent.getWorldPosition()
            position.x += parentPosition.x
            position.y += parentPosition.y
        }
        return position
    }

    paint(g) {
        let origin = undefined
        if(this.properties.parent) {
            origin = this.properties.parent.getWorldPosition()
        } else {
            origin = new Point(0, 0)
        }
        let shapePoints = this.getShapePoints(origin)
        let element = this
        let worldPosition = this.getWorldPosition()
        while(element) {
            let elementWorldPosition = element.getWorldPosition()
            this.transformPoints([worldPosition], elementWorldPosition, element.properties.angle)
            this.transformPoints(shapePoints, elementWorldPosition, element.properties.angle)
            element = element.properties.parent
        }
        if(shapePoints.length > 0) {
            g.beginPath()
            let lastPoint = shapePoints[shapePoints.length - 1]
            g.moveTo(lastPoint.x, lastPoint.y)
            for(let i = 0; i < shapePoints.length; i++) {
                let point = shapePoints[i]
                g.lineTo(point.x, point.y)
            }
            g.closePath()
            g.fillStyle = this.properties.shapeColor
            g.fill()
            if(this.properties.paintBorder) {
                g.strokeStyle = this.properties.borderColor
                g.stroke()
            }
        }
        for(let i = 0; i < this.properties.subElements.length; i++) {
            this.properties.subElements[i].paint(g)
        }
        if(this.properties.paintPosition) {
            g.beginPath()
            g.arc(worldPosition.x, worldPosition.y, 5, 0, Math.PI * 2)
            g.closePath()
            g.fillStyle = this.properties.positionColor
            g.fill()
            g.strokeStyle = "black"
            g.stroke()
        }
    }
}

/* 

width: number
height: number

*/
class Rectangle extends GeometricShape {

    constructor(properties) {
        super(properties)
    }

    getShapePoints() {
        let worldPosition = this.getWorldPosition()
        return [
            new Point(
                worldPosition.x + this.properties.xShift, 
                worldPosition.y + this.properties.yShift
            ),
            new Point(
                worldPosition.x + this.properties.width + this.properties.xShift,
                worldPosition.y + this.properties.yShift
            ),
            new Point(
                worldPosition.x + this.properties.width + this.properties.xShift,
                worldPosition.y + this.properties.height + this.properties.yShift
            ),
            new Point(
                worldPosition.x + this.properties.xShift, 
                worldPosition.y + this.properties.height + this.properties.yShift
            )
        ]
    }
}
