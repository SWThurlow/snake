//Start game.
const startGame = document.querySelector('.startGame');
const startBtn  = startGame.childNodes[1];

//End game msg.
const endGame = document.querySelector('.endGame');
const playAgain = endGame.childNodes[3];

//Setting up the canavas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

//Scale to make everything work as squares on the canvas. Rows and columns to use for locations and collision detection.
const scale = 10;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

//Variables for drawing the snake and  fruit and detecting if our snake is eating the fruit.
let snakeX = (columns / 2) * scale;
let snakeY = (rows / 2) * scale;
let fruitX;
let fruitY;

//Variables to let the snake slither.
let xSpeed = scale * 1;
let ySpeed = 0;
let direction = '';
let tail = [];

let score = 0;

//Listening out for which way to go.
document.addEventListener("keydown", keyDownHandler);

function keyDownHandler(e) {
    e.preventDefault();
    if (e.key == "Right" || e.key == "ArrowRight") {
        xSpeed = scale;
        ySpeed = 0;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        xSpeed = -scale;
        ySpeed = 0;
    } else if (e.key == "Up" || e.key == "ArrowUp") {
        xSpeed = 0;
        ySpeed = -scale;
    } else if (e.key == "Down" || e.key == "ArrowDown") {
        xSpeed = 0;
        ySpeed = scale;
    }
}



//Snake drawing function.
function drawSnake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Head of the snake.
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.fillRect(snakeX, snakeY, scale, scale);
    ctx.closePath();

    //Drawing the tail.
    for (let i = 0; i < tail.length; i++) {
        ctx.fillRect(tail[i].x,
            tail[i].y, scale, scale);
    }

    //Slithering along.
    snakeX += xSpeed;
    snakeY += ySpeed;

    //Going over the edge.
    if (snakeX >= canvas.width) {
        snakeX = 0;
    }

    if (snakeY >= canvas.height) {
        snakeY = 0;
    }

    if (snakeX < 0) {
        snakeX = canvas.width;
    }

    if (snakeY < 0) {
        snakeY = canvas.height;
    }

    //Updating the tail.
    if (score > 0) {
        for (let i = 0; i < score; i++) {
            tail[i] = tail[i + 1];
        }
        tail[score - 1] = { x: snakeX, y: snakeY };
    }

}

//Fruit picking.
function pickFruit() {
    fruitX = (Math.floor(Math.random() *
        columns - 1) + 1) * scale;
    fruitY = (Math.floor(Math.random() *
        rows - 1) + 1) * scale;

    if (fruitX === snakeX && fruitY === snakeY) {
        pickFruit();
    }
}


//Feeding the snake.
function eat() {
    if (snakeX === fruitX && snakeY === fruitY) {
        score++;
        tail.push({ x: fruitX, y: fruitY });
        pickFruit();
    }
}

//Making sure the snake doesn't turn into an ouroboros.
function collisionDetection() {
    for (let i = 0; i < tail.length - 2; i++) {
        if (tail[i].x === snakeX && tail[i].y === snakeY) {
            clearInterval(playingSnake);
            playingSnake = null;
            endGame.style.cssText = 'visibility: visible; left: 0px;';
        }
    }
}


//Main game function.
//Initial fruit picked out side of playSnake to keep fruit x and y consitent.
pickFruit();

function playSnake() {
    collisionDetection();
    eat();
    drawSnake();
    ctx.beginPath();
    ctx.fillStyle = "#4cafab";
    ctx.fillRect(fruitX, fruitY, scale, scale)
    ctx.closePath();
}

let playingSnake;


/*Event listeners to start game and play again.*/
function toStartGame() {
    startBtn.style.cssText = 'visibility: hidden; left: 300px;'
    playing = true;
    playingSnake = setInterval(playSnake, 250);
}
startBtn.addEventListener('click', toStartGame);

function playingAgain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    endGame.style.cssText = 'visibility: hidden; left: -300px;';
    pickFruit();
    snakeX = (columns / 2) * scale;
    snakeY = (rows / 2) * scale;
    tail.splice(0, tail.length);
    playingSnake = setInterval(playSnake, 250);
}
playAgain.addEventListener('click', playingAgain);