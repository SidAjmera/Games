const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const HEIGHT = 400;
const WIDTH = 600;
const BGCOLOR = "black";
const GAP = 10;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const FGCOLOR = "white";

// User object
const user = {
     x: GAP,
     y: HEIGHT / 2,
     width: PADDLE_WIDTH,
     height: PADDLE_HEIGHT,
     color: FGCOLOR,
     score: 0,
}

// Computer object
const computer = {
     x: WIDTH - GAP - PADDLE_WIDTH,
     y: HEIGHT / 2,
     width: PADDLE_WIDTH,
     height: PADDLE_HEIGHT,
     color: FGCOLOR,
     score: 0,
}

// Ball object
const ball = {
     x: WIDTH / 2,
     y: HEIGHT / 2,
     radius: 10,
     color: FGCOLOR,
     speed: 5,
     velocityX: 2,
     velocityY: 2,
}

function touchingUser() {
     if (
          ball.x < (GAP + PADDLE_WIDTH) &&
          ball.x > (GAP) &&
          ball.y > user.y &&
          ball.y < (user.y + PADDLE_HEIGHT)
     ) {
          return true;
     } else {
          return false;
     }
}

function touchingComputer() {
     if (
          ball.x < (WIDTH - GAP) &&
          ball.x > (WIDTH - GAP - PADDLE_WIDTH) &&
          ball.y > computer.y &&
          ball.y < (computer.y + PADDLE_HEIGHT)
     ) {
          return true;
     } else {
          return false;
     }
}

function drawText(text, x, y, color) {
     ctx.fillStyle = color;
     ctx.font = "75px Fantasy";
     ctx.fillText(text, x, y);
}

function resetBall() {
     // Put ball back in the center
     ball.x = WIDTH / 2;
     ball.y = HEIGHT / 2;

     // Reverse the ball direction
     ball.velocityX = -ball.velocityX;
}

function update() {
     // Everything related to motion goes here
     ball.x += ball.velocityX;
     ball.y += ball.velocityY;

     // Bounce off top edge
     if (ball.y < 0) {
          ball.velocityY = -ball.velocityY;
     }

     // Bounce of bottom edge
     if (ball.y > HEIGHT) {
          ball.velocityY = -ball.velocityY;
     }

     // Bounce off the user paddle
     if (touchingUser()) {
          ball.velocityX = -ball.velocityX;
     }

     // Bounce off the computer paddle
     if (touchingComputer()) {
          ball.velocityX = -ball.velocityX;
     }

     // Handling the score when the ball goes out of bounds (left or right edge)
     if (ball.x < 0) {
          computer.score++;
          resetBall();
     } else if (ball.x > WIDTH) {
          user.score++;
          resetBall();
     }

     // Making the computer paddle follow the ball with a delay and randomness
     const followSpeed = 0.04; // Adjust this value for how quickly the computer reacts
     const randomOffset = Math.random() * 60 - 30;

     if (ball.velocityX > 0 && ball.x > WIDTH / 2) {
          if (ball.y > computer.y + PADDLE_HEIGHT / 2 + randomOffset) {
               computer.y += followSpeed * (ball.y - (computer.y + PADDLE_HEIGHT / 2));
          } else if (ball.y < computer.y + PADDLE_HEIGHT / 2 + randomOffset) {
               computer.y -= followSpeed * ((computer.y + PADDLE_HEIGHT / 2) - ball.y);
          }
     }

     // Ensure the computer paddle stays within the canvas
     if (computer.y < 0) {
          computer.y = 0;
     } else if (computer.y > HEIGHT - PADDLE_HEIGHT) {
          computer.y = HEIGHT - PADDLE_HEIGHT;
     }
}

function drawRect(x, y, w, h, color) {
     ctx.fillStyle = color;
     ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
     ctx.fillStyle = color;
     ctx.beginPath();
     ctx.arc(x, y, r, 0, Math.PI * 2, false);
     ctx.closePath();
     ctx.fill();
}

function render() {
     // Draw Background rectangle
     drawRect(0, 0, WIDTH, HEIGHT, BGCOLOR);

     // Draw the net
     drawRect(WIDTH / 2, 0, 5, HEIGHT, FGCOLOR);

     // Draw User paddle
     drawRect(user.x, user.y, user.width, user.height, user.color);

     // Draw Computer paddle
     drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);

     // Draw ball
     drawCircle(ball.x, ball.y, ball.radius, ball.color);

     // Render the score
     // Render the user score
     drawText(user.score, WIDTH / 4, HEIGHT / 5, FGCOLOR);

     // Render the computer score
     drawText(computer.score, 3 * WIDTH / 4, HEIGHT / 5, FGCOLOR);
}

function game() {
     update();
     render();
}

function getMousePos(event) {
     const rect = canvas.getBoundingClientRect();
     let newY = event.clientY - rect.top - user.height / 2;

     // If paddle would go above the top
     if (newY < 0) {
          newY = 0;
     }
     // If paddle would go below the bottom
     else if (newY > HEIGHT - user.height) {
          newY = HEIGHT - user.height;
     }

     user.y = newY;
}

// Adding event listener for checking mouse move
canvas.addEventListener('mousemove', getMousePos);

const fps = 120;
setInterval(game, 1000 / fps);