let direction = "right";
let gridSize = 400;
let unitLength = 10;
let snake = [];
let foodPosition = { x: 0, y: 0 };
let collided = false;
let timer = setInterval(gameLoop, 200);
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let gameOverScreen = document.getElementById("game-over-screen");

function setUp() {
  // Drawing borders on canvas
  canvasSideLength = gridSize + unitLength * 2;
  ctx.fillRect(0, 0, canvasSideLength, canvasSideLength);
  ctx.clearRect(unitLength, unitLength, gridSize, gridSize);

  // Setting up the snake
  const headPosition = Math.floor(gridSize / 2) + 30;
  const tailPosition = Math.floor(gridSize / 2) - 30;

  for (let i = tailPosition; i <= headPosition; i += unitLength) {
    let y = Math.floor(gridSize / 2);
    let x = i;

    snake.push({ x, y });
    ctx.fillRect(x, y, unitLength, unitLength);
  }

  // Generate food
  generateFood();
}

function move() {
  // Create a copy of the object representing the position of the head
  const headPosition = Object.assign({}, snake.slice(-1)[0]);

  switch (direction) {
    case "left":
      headPosition.x -= unitLength;
      break;
    case "right":
      headPosition.x += unitLength;
      break;
    case "up":
      headPosition.y -= unitLength;
      break;
    case "down":
      headPosition.y += unitLength;
  }

  // Add the new headPosition to the array
  snake.push(headPosition);

  ctx.fillRect(headPosition.x, headPosition.y, unitLength, unitLength);

  // Check if snake is eating
  const isEating =
    foodPosition.x == headPosition.x && foodPosition.y == headPosition.y;

  if (isEating) {
    // Generate new food position
    generateFood();
  } else {
    // Remove the tail if the snake is not eating
    tailPosition = snake.shift();

    // Remove tail from grid
    ctx.clearRect(tailPosition.x, tailPosition.y, unitLength, unitLength);
  }
}

function doesSnakeOccupyPosition(x, y) {
  snake.find((position) => {
    return position.x == x && y == foodPosition.y;
  });
}

function generateFood() {
  let x = 0,
    y = 0;
  do {
    x = Math.floor((Math.random() * gridSize) / 10) * 10;
    y = Math.floor((Math.random() * gridSize) / 10) * 10;
  } while (doesSnakeOccupyPosition(x, y));

  foodPosition = { x, y };
  ctx.fillRect(x, y, unitLength, unitLength);
}

function turn(newDirection) {
  switch (newDirection) {
    case "left":
    case "right":
      // Only allow turning left or right if they were originally moving up or down
      if (direction == "up" || direction == "down") {
        direction = newDirection;
      }
      break;
    case "up":
    case "down":
      // Only allow turning up or down if they were originally moving left or right
      if (direction == "left" || direction == "right") {
        direction = newDirection;
      }
      break;
  }
}

function checkForCollision() {
  const headPosition = snake.slice(-1)[0];
  // Check for collisions against left and right walls
  if (headPosition.x < 0 || headPosition.x >= gridSize - 1) {
    collided = true;
  }

  // Check for collisions against top and bottom walls
  if (headPosition.y < 0 || headPosition.y >= gridSize - 1) {
    collided = true;
  }

  // Check for collisions against the snake itself
  const body = snake.slice(0, -2);
  if (
    body.find(
      (position) => position.x == headPosition.x && position.y == headPosition.y
    )
  ) {
    collided = true;
  }
}

function draw() {}

function onKeyDown(e) {
  switch (e.key) {
    case "ArrowDown":
      turn("down");
      break;
    case "ArrowUp":
      turn("up");
      break;
    case "ArrowLeft":
      turn("left");
      break;
    case "ArrowRight":
      turn("right");
      break;
  }
}

function gameLoop() {
  move();
  checkForCollision();

  if (collided) {
    clearInterval(timer);
    gameOverScreen.style.display = "flex";
  }
}

setUp();
document.addEventListener("keydown", onKeyDown);
draw();
