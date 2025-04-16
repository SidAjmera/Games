const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
     x: 50,
     y: 300,
     vx: 0,
     vy: 0,
     width: 20,
     height: 20
};

const gravity = 0.4;
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem('platformerHighScore') || 0;
highScore = parseInt(highScore);

const MAX_JUMP_HEIGHT = 140;
const MAX_JUMP_DISTANCE = 350;

function isColliding(player, platform) {
    return player.x < platform.x + platform.width &&
           player.x + player.width > platform.x &&
           player.y < platform.y + platform.height &&
           player.y + player.height > platform.y;
}

function isOnTopOfPlatform(player, platform) {
    const playerBottom = player.y + player.height;
    const platformTop = platform.y;
    
    return player.x + player.width > platform.x &&
           player.x < platform.x + platform.width &&
           playerBottom >= platformTop - 2 &&
           playerBottom <= platformTop + 5 &&
           player.vy >= 0;
}

function willCollideVertically(player, platform, nextY) {
    const playerBottom = nextY + player.height;
    const platformTop = platform.y;
    
    return player.x + player.width > platform.x &&
           player.x < platform.x + platform.width &&
           playerBottom >= platformTop &&
           player.y < platform.y + platform.height;
}

function updateGame() {
    if (gameOver) return;
    
    player.vy += gravity;
    
    const originalX = player.x;
    const originalY = player.y;
    
    player.x += player.vx;
    
    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
    
    platforms.forEach(platform => {
        if (isColliding(player, platform)) {
            if (player.vx > 0) {
                player.x = platform.x - player.width;
            } else if (player.vx < 0) {
                player.x = platform.x + platform.width;
            }
        }
    });
    
    const nextY = player.y + player.vy;
    let willLand = false;
    
    let onStartingPlatform = false;
    let onAnyPlatform = false;
    
    platforms.forEach(platform => {
        if (willCollideVertically(player, platform, nextY) && player.vy > 0) {
            if (player.y + player.height <= platform.y + 5) {
                willLand = true;
                player.y = platform.y - player.height;
                player.vy = 0;
                onAnyPlatform = true;
                
                if (platform === platforms[0]) {
                    onStartingPlatform = true;
                }
            }
        }
    });
    
    if (!willLand) {
        player.y = nextY;
        
        if (player.y < 0) {
            player.y = 0;
            player.vy = 0;
        }
        
        platforms.forEach(platform => {
            if (isColliding(player, platform) && !isOnTopOfPlatform(player, platform)) {
                if (player.vy < 0) {
                    player.y = platform.y + platform.height;
                    player.vy = 0;
                } else if (originalY + player.height <= platform.y && player.vy > 0) {
                    player.y = platform.y - player.height;
                    player.vy = 0;
                    onAnyPlatform = true;
                    
                    if (platform === platforms[0]) {
                        onStartingPlatform = true;
                    }
                }
            }
        });
    }
    
    if (player.y + player.height > canvas.height - 50) {
        gameOver = true;
        player.vx = 0;
        player.vy = 0;
        
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('platformerHighScore', highScore);
        }
        return;
    }
    
    player.canJump = onAnyPlatform;
    
    if (!onStartingPlatform && platforms[0].vx === 0) {
        platforms[0].vx = -1 * (Math.random() * 1.5 + 0.5);
        console.log("Starting platform now moving");
    }

    platforms.forEach(platform => {
        if (isOnTopOfPlatform(player, platform) && !platform.visited) {
            platform.visited = true;
            if (platform !== platforms[0]) {
                score += 1;
            }
        }
    });
}

function drawBg() {
     ctx.fillStyle = '#87ceeb';
     ctx.fillRect(0, 0, canvas.clientWidth, canvas.height);

     ctx.fillStyle = '#654321';
     ctx.fillRect(0, canvas.height - 50, canvas.clientWidth, 50);
}

const platforms = [
    { x: 20, y: 320, width: 100, height: 10, vx: 0 }
];

for (let i = 1; i < 6; i++) {
    const xOffset = 100 + (i * 200);
    const prevY = i > 1 ? platforms[i-1].y : 320;
    
    const minY = Math.max(prevY - MAX_JUMP_HEIGHT + 30, 100);
    const maxY = Math.min(prevY + 60, canvas.height - 150);
    
    platforms.push({ 
        x: xOffset,
        y: minY + Math.random() * (maxY - minY),
        width: Math.floor(Math.random() * 50) + 70,
        height: 10,
        vx: -1 * (Math.random() * 1 + 0.8),
        visited: false
    });
}

function drawPlatforms() {
    ctx.fillStyle = '#8B4513';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function drawPlayer() {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawGameWorld() {
    drawBg();
    drawPlatforms();
    drawPlayer();
    
    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Score: ' + score, 10, 30);
    ctx.fillText('High Score: ' + highScore, 10, 60);
    
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
        ctx.font = '18px Arial';
        ctx.fillText('Final Score: ' + score, canvas.width/2, canvas.height/2 + 30);
        
        if (score >= highScore) {
            ctx.fillText('New High Score!', canvas.width/2, canvas.height/2 + 60);
        } else {
            ctx.fillText('High Score: ' + highScore, canvas.width/2, canvas.height/2 + 60);
        }
        
        ctx.fillText('Press Space to restart', canvas.width/2, canvas.height/2 + 90);
    }
}

function updatePlatforms() {
    let rightmostPlatform = platforms[0];
    platforms.forEach(platform => {
        if (platform.x > rightmostPlatform.x) {
            rightmostPlatform = platform;
        }
    });

    platforms.forEach(platform => {
        platform.x += platform.vx;

        if (platform.x + platform.width < 0) {
            const minX = rightmostPlatform.x + 120;
            const maxX = rightmostPlatform.x + 220;
            platform.x = canvas.width + Math.random() * 50;
            
            const nearestPlatform = findNearestVisiblePlatform();
            
            if (nearestPlatform) {
                const minHeight = Math.max(nearestPlatform.y - MAX_JUMP_HEIGHT + 20, 100);
                const maxHeight = Math.min(nearestPlatform.y + 60, canvas.height - 150);
                platform.y = minHeight + Math.random() * (maxHeight - minHeight);
            } else {
                platform.y = Math.floor(Math.random() * 150) + 150;
            }
            
            platform.width = Math.floor(Math.random() * 50) + 70;
            platform.vx = -1 * (Math.random() * 1 + 0.8);
            platform.visited = false;
            rightmostPlatform = platform;
        } else if (platform.x > canvas.width) {
            platform.x = -platform.width;
        }
    });
}

function findNearestVisiblePlatform() {
    let nearestPlatform = null;
    let nearestDistance = Infinity;
    
    platforms.forEach(platform => {
        if (platform.x > 0 && platform.x < canvas.width) {
            const distance = Math.abs(platform.x - player.x) + Math.abs(platform.y - player.y);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestPlatform = platform;
            }
        }
    });
    
    return nearestPlatform;
}

function gameLoop() {
    updateGame();
    
    if (!gameOver) {
        updatePlatforms();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGameWorld();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener('keydown', function(event) {
    if (gameOver && event.key === ' ') {
        player.x = 50;
        player.y = 300;
        player.vx = 0;
        player.vy = 0;
        gameOver = false;
        score = 0;
        
        platforms[0] = { x: 20, y: 320, width: 100, height: 10, vx: 0 };
        
        for (let i = 1; i < platforms.length; i++) {
            const xOffset = 100 + (i * 250);
            platforms[i] = { 
                x: xOffset,
                y: Math.floor(Math.random() * 180) + 120,
                width: Math.floor(Math.random() * 50) + 70,
                height: 10,
                vx: -1 * (Math.random() * 1.5 + 0.5),
                visited: false
            };
        }
        
        return;
    }
    
    if (gameOver) return;
    
    switch(event.key) {
        case 'ArrowLeft':
            player.vx = -3.5; 
            break;
        case 'ArrowRight':
            player.vx = 3.5; 
            break;
        case 'ArrowUp':
            if (player.canJump) { 
                player.vy = -12; 
            }
            break;
    }
});

window.addEventListener('keyup', function(event) {
    switch(event.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
            player.vx = 0;
            break;
    }
});