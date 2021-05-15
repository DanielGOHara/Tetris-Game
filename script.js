document.addEventListener('DOMContentLoaded', () => {

  // Assigns information from the CSS file to const & let variables using a query function. --------------------------

  const grid = document.querySelector('.grid')
  const displaySquares = document.querySelectorAll('.minigrid div')
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#startButton')
  const restartBtn = document.querySelector('#restartButton');
  let squares = Array.from(document.querySelectorAll('.grid div'))

  // Creates basic const & let variables and assigns values to them. -------------------------------------------------

  const width = 10, displayWidth = 4
  const colors = ['orange', 'red', 'purple', 'green', 'blue']
  let nextRandom = 0, score = 0, displayIndex = 0
  let timerid;

  // Creates arrays for each type of Tetromino. ----------------------------------------------------------------------

  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ];

  const zTetromino = [
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1]
  ];

  const tTetromino = [
    [1,width,width+1,width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ];

  const oTetromino = [
    [1, 2, width+1, width+2],
    [1, 2, width+1, width+2],
    [1, 2, width+1, width+2],
    [1, 2, width+1, width+2]
  ];

  const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ];

  // Create array that stores each Tetromino array. ------------------------------------------------------------------

  const theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
  let currentPosition = 4, currentRotation = 0;

  // Variables that randomly selects a Tetromino. --------------------------------------------------------------------

  let random = Math.floor(Math.random() * theTetrominos.length);
  let current = theTetrominos[random][currentRotation];

  // Draw & Undraw Functions. ----------------------------------------------------------------------------------------

  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino');
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino');
      squares[currentPosition + index].style.backgroundColor = '';
    });
  }

  // Assign button presses to functions. -----------------------------------------------------------------------------

  function control(event) {
    if(event.keyCode === 37 && timerid != null) {        //Move Left
      moveLeft();
    } else if(event.keyCode === 38 && timerid != null) { //Rotate
      rotate();
    } else if(event.keyCode === 39 && timerid != null) { //Move Right
      moveRight();
    } else if(event.keyCode === 40 && timerid != null) { //Move Down
      moveDown();
    }
  }

  document.addEventListener('keyup', control);

  // Movement Functions. ---------------------------------------------------------------------------------------------

  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'));

      // Start a new Tetromino.

      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominos.length);
      current = theTetrominos[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

    if(!isAtLeftEdge) currentPosition -= 1;

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1;
    }
    draw();
  }

  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

    if(!isAtRightEdge) currentPosition += 1;

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1;
    }
    draw();
  }

  // Rotate Function. ------------------------------------------------------------------------------------------------

  function rotate() {

    // Depending on which tetromino is currently used certain parameters will be set for when it is rotated near edges.

    if(random !== 3) {
      if(random === 0 || random === 1 || random === 2) {
        if(random !== 1) {
          if (currentPosition % 10 === 8) {
            undraw();
            currentPosition -= 1;
            draw();
          } else if (currentPosition % 10 === 9) {
            undraw();
            currentPosition += 1;
            draw()
          }
        } else {
          if (currentPosition % 10 === 8) {
            undraw();
            currentPosition -= 1;
            draw();
          }
        }
      } else if(random === 4) {
        if (currentPosition % 10 === 8) {
          undraw();
          currentPosition -= 2;
          draw();
        } else if (currentPosition % 10 === 9) {
          undraw();
          currentPosition += 1;
          draw();
        }
      }
      undraw();
      currentRotation++;
      if (currentRotation === current.length) {
        currentRotation = 0;
      }
      current = theTetrominos[random][currentRotation];
      draw();
    }
  }


  // Display next Tetromino variable. --------------------------------------------------------------------------------

  const upNextTetromino = [
    [1, displayWidth+1, displayWidth*2+1, 2],
    [displayWidth+1, displayWidth+2, displayWidth*2, displayWidth*2+1],
    [1, displayWidth, displayWidth+1, displayWidth+2],
    [displayWidth+1, displayWidth+2, displayWidth*2+1, displayWidth*2+2],
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
  ]

  function displayShape() {

    //Remove any trace of Tetromino.

    displaySquares.forEach(squares => {
      squares.classList.remove('tetromino');
      squares.style.backgroundColor = '';
    });
    upNextTetromino[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino');
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    });
  }

  // General game functionality functions. ---------------------------------------------------------------------------

  function addScore() {
    for(let i = 0; i < 199; i += width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

      if(row.every(index => squares[index].classList.contains('taken'))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach(index => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
          squares[index].style.backgroundColor = '';
        });
        const squaresRemoved = squares.splice(i , width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
      }
    }
  }

  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'Game Over!';
      clearInterval(timerid);
    }
  }

  function start_pause() {
    if(score !== "Game Over!") {
      if (timerid) {
        clearInterval(timerid)
        timerid = null
      } else {
        draw()
        timerid = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random() * theTetrominos.length)
        displayShape()
      }
    }
  }

  // Event Listeners for the start/pause & restart buttons.

  startBtn.addEventListener('click', () => {
    start_pause();
  });

  restartBtn.addEventListener('click', () => {
    location.reload();
  });
});