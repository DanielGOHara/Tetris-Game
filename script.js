document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start_button')
    const width = 10
    let nextRandom = 0, score = 0
    let timerid

    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1]
    ]

    const tTetromino = [
        [1,width,width+1,width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]

    const oTetromino = [
        [1, 2, width+1, width+2],
        [1, 2, width+1, width+2],
        [1, 2, width+1, width+2],
        [1, 2, width+1, width+2]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0

    //Randomly select a tetromino
    let random = Math.floor(Math.random() * theTetrominos.length)
    let current = theTetrominos[random][currentRotation]

    //Draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }

    //Assign functions to keycodes
    function control(e) {
        if(e.keyCode === 37) {        //Move Left
            moveLeft()
        } else if(e.keyCode === 38) { //Rotate
            rotate()
        } else if(e.keyCode === 39) { //Move Right
            moveRight()
        } else if(e.keyCode === 40) { //Move Down
            moveDown()
        }
    }

    document.addEventListener('keyup', control)

    //Move down function
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //Start a new tetromino
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominos.length)
            current = theTetrominos[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtLeftEdge) currentPosition -= 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }

    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

        if(!isAtRightEdge) currentPosition += 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }

    function rotate() {
        undraw()
        currentRotation++
        if(currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominos[random][currentRotation]
        draw()
    }

    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    const displaySqaures = document.querySelectorAll('.minigrid div')
    const displayWidth = 4
    let displayIndex = 0

    const upNextTetromino = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [displayWidth+1, displayWidth+2, displayWidth*2, displayWidth*2+1],
        [1, displayWidth, displayWidth+1, displayWidth+2],
        [displayWidth+1, displayWidth+2, displayWidth*2+1, displayWidth*2+2],
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
    ]

    function displayShape() {
        //Remove any trace of tetromino
        displaySqaures.forEach(squares => {
            squares.classList.remove('tetromino')
        })
        upNextTetromino[nextRandom].forEach(index => {
            displaySqaures[displayIndex + index].classList.add('tetromino')
        })
    }

    function addScore() {
        for(let i = 0; i < 199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                })
                const squaresRemoved = squares.splice(i , width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'Game Over!'
            clearInterval(timerid)
        }
    }

    function restart() {

    }

    startBtn.addEventListener('click', () => {
        if(timerid) {
            clearInterval(timerid)
            timerid =  null
        } else {
            draw()
            timerid = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominos.length)
            displayShape()
        }
    })

})