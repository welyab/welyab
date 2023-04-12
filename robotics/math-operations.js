function toRadians(degrees) {
    return degrees * (Math.PI / 180)
}

function toDegrees(radians) {
    return radians * (180 / Math.PI)
}

class Matrix {
    constructor(lines, columns, content = []) {
        this.lines = lines
        this.columns = columns
        this.content = content
    }

    multiply(other) {
        let result = new Matrix(this.lines, other.columns)
        for(let line = 0; line < this.lines; line++) {
            for(let column = 0; column < other.columns; column++) {
                if(result.content[line] === undefined) result.content[line] = []
                result.content[line][column] = 0
                for(let i = 0; i < other.lines; i++) {
                    result.content[line][column] +=
                        this.content[line][i]
                        * other.content[i][column]
                }
            }
        }
        return result
    }
}
