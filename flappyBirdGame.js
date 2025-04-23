// Variables that are constant
const canvas = document.getElementById("flappyBird");
const ctx = canvas.getContext("2d");
ctx.font = "20px Arial";
ctx.fillStyle = "white";

// Variables that can change
var bg = new Image();
var base = new Image();
var bird = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();
var readyScreen = new Image();
var gameover = new Image();
var bx = 25;
var by = 256;
var gravity = 0.04;
var yvel = 0;
var pipeX = canvas.width - 20;
var pipeNorthY = Math.floor(Math.random() * 201) - 200;
var pipeSouthY = pipeNorthY + 320 + 70;
var pipeSpeed = 2;
var state = "ready";
var score = 0;
var FBhighScore = 0;
var ready = true;
var highScoreSaved = false;
var computerScore = 0;


// Set image source
bg.src = "Flappy_Bird_Assets1/sprites/background-day.png";
base.src = "Flappy_Bird_Assets1/sprites/base.png";
bird.src = "Flappy_Bird_Assets1/sprites/bluebird-midflap.png";
pipeNorth.src = "Flappy_Bird_Assets1/sprites/pipe-green-north.png";
pipeSouth.src = "Flappy_Bird_Assets1/sprites/pipe-green-south.png";
readyScreen.src = "Flappy_Bird_Assets1/sprites/message.png";
gameover.src = "Flappy_Bird_Assets1/sprites/gameover.png";



document.addEventListener("click", handleGameStates);

function handleGameStates () {
     if (state == "running") {
          yvel = -1;
     } else if (state == "ready") {
          state = "running";
     } else if (state == "over") {
          state = "ready";
          // Reset game variables
          bx = 25;
          by = 256;
          yvel = 0;
          pipeX = canvas.width - 20;
          pipeNorthY = Math.floor(Math.random() * 201) - 200;
          pipeSouthY = pipeNorthY + 320 + 70;
          score = 0;
     }
}

function isCollided () {
     // Check if bird is within the pipe's x-axis range
     if (bx + bird.width > pipeX && bx < pipeX + pipeNorth.width) {
          // Check if bird hits the pipes (not in the gap)
          if (by < pipeNorthY + 320 || by + bird.height > pipeSouthY) {
               return true;
          }
     }
     return false;
}


function update() {
     if (state == "running") {
          yvel = yvel + gravity;
          by = by + yvel;
          pipeX = pipeX - pipeSpeed;

          if (by > 379) {
               by = 379;
          }

          if (by < 0) {
               by = 0;
          }

          if (isCollided()) {
               state = "over";
          }

          if ((pipeX + 52) < 0) {
               pipeX = canvas.width;
               pipeNorthY = Math.floor(Math.random() * 201) - 200;
               pipeSouthY = pipeNorthY + 320 + 70;
               ready = true;
          }
     }
     updateHighScore();
}

function updateScore() {
     if (bx > pipeX + pipeNorth.width && ready) {
          score = score + 1;
          ready = false;
          return true;
     }
}

function updateHighScore() {
     if (!highScoreSaved) {const storedHighScore = localStorage.getItem('FBhighScore');
          if (storedHighScore) {
               FBhighScore = parseInt(storedHighScore, 10);
               if (FBhighScore < score) {
                    FBhighScore = score;
                    localStorage.setItem('FBhighScore', FBhighScore);
               }
          } else {
               FBhighScore = score;
               localStorage.setItem('FBhighScore', FBhighScore);
          }
     }
}

function loadingHighScore() {
     const storedHighScore = localStorage.getItem('FBhighScore');
     if (storedHighScore) {
          FBhighScore = parseInt(storedHighScore, 10);
     } else {
          FBhighScore = 0;
     }

}

loadingHighScore();

function render() {
     ctx.drawImage(bg, 0, 0);
     if (state == "running") {
          ctx.drawImage(bird, bx, by);
          ctx.drawImage(pipeNorth, pipeX, pipeNorthY);
          ctx.drawImage(pipeSouth, pipeX, pipeSouthY);
          ctx.drawImage(base, 0, 400);
          ctx.fillText('Score: ' + String(score), 20, 50);
          updateScore();
          ctx.fillText('High Score: ' + String(Math.max(score, FBhighScore)), 20, 80);
     } else if (state == "ready") {
          ctx.drawImage(readyScreen, 50, 100);
     } else if (state == "over") {
          ctx.drawImage(gameover, 50, 250);

     }     

}

function game(){
     update();
     render();
}

const fps = 60;

setInterval(game, 1000/fps);

// New function to end the game
function endGame(winner) {
     state = "over";
     // Display winner message
     ctx.fillStyle = "white";
     ctx.fillText(winner + " won!", canvas.width / 2 - 50, canvas.height / 2);
     // Show restart button
     showRestartButton();
}

// Function to show restart button
function showRestartButton() {
     const restartButton = document.createElement("button");
     restartButton.innerText = "Restart";
     restartButton.style.position = "absolute";
     restartButton.style.top = "50%";
     restartButton.style.left = "50%";
     restartButton.style.transform = "translate(-50%, -50%)";
     document.body.appendChild(restartButton);
     restartButton.onclick = function() {
          document.body.removeChild(restartButton);
          resetGame();
     };
}

// Function to reset the game
function resetGame() {
     // Reset game variables
     bx = 25;
     by = 256;
     yvel = 0;
     pipeX = canvas.width - 20;
     pipeNorthY = Math.floor(Math.random() * 201) - 200;
     pipeSouthY = pipeNorthY + 320 + 70;
     score = 0;
     computerScore = 0; // Reset computer score
     state = "ready";
     ready = true;
}