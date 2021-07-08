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

//Score variable, seems fairly apprent, I'm not too sure what else there is to say about that one.

let score = 0;

//Listening out for which way to go.

document.addEventListener("keydown", keyDownHandler);

function keyDownHandler(evt) {
    if (evt.key == "Right" || evt.key == "ArrowRight") {
        xSpeed = scale;
        ySpeed = 0;
    } else if (evt.key == "Left" || evt.key == "ArrowLeft") {
        xSpeed = -scale;
        ySpeed = 0;
    } else if (evt.key == "Up" || evt.key == "ArrowUp") {
        xSpeed = 0;
        ySpeed = -scale;
    } else if (evt.key == "Down" || evt.key == "ArrowDown") {
        xSpeed = 0;
        ySpeed = scale;
    }
}



//Snake drawing function.

function drawSnake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

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

    if (snakeX > canvas.width) {
        snakeX = 0;
    }

    if (snakeY > canvas.height) {
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
        console.log(tail);
    }
}

//Making sure the snake doesn't turn into an ouroboros.

function collisionDetection() {
    for (let i = 0; i < tail.length - 2; i++) {
        if (tail[i].x === snakeX && tail[i].y === snakeY) {
            alert('Game Over!')
        }
    }
}


//Main game function.

//Initial fruit picked out side of playSnake to keep fruit x and y consitent.

pickFruit();

function playSnake() {
    drawSnake();
    eat();
    ctx.beginPath();
    ctx.fillStyle = "#4cafab";
    ctx.fillRect(fruitX, fruitY, scale, scale)
    ctx.closePath();
    collisionDetection();
}
setInterval(playSnake, 250);