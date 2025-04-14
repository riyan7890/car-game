document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const road = document.getElementById('road');
    const playerCar = document.getElementById('player-car');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const gameOverDisplay = document.getElementById('game-over');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    
    // Game variables
    let gameRunning = false;
    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    let playerPosition = 50; // percentage from left
    let gameSpeed = 5;
    let obstacleSpeed = 5;
    let obstacleInterval;
    let coinInterval;
    let roadAnimation;
    let keysPressed = {};
    
    highScoreDisplay.textContent = highScore;
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        keysPressed[e.key] = true;
        
        if (gameRunning) {
            if (e.key === 'ArrowLeft') {
                moveLeft();
            } else if (e.key === 'ArrowRight') {
                moveRight();
            }
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keysPressed[e.key] = false;
    });
    
    // Mobile controls
    leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keysPressed['ArrowLeft'] = true;
        if (gameRunning) moveLeft();
    });
    
    rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keysPressed['ArrowRight'] = true;
        if (gameRunning) moveRight();
    });
    
    leftBtn.addEventListener('touchend', () => {
        keysPressed['ArrowLeft'] = false;
    });
    
    rightBtn.addEventListener('touchend', () => {
        keysPressed['ArrowRight'] = false;
    });
    
    leftBtn.addEventListener('mousedown', () => {
        keysPressed['ArrowLeft'] = true;
        if (gameRunning) moveLeft();
    });
    
    rightBtn.addEventListener('mousedown', () => {
        keysPressed['ArrowRight'] = true;
        if (gameRunning) moveRight();
    });
    
    leftBtn.addEventListener('mouseup', () => {
        keysPressed['ArrowLeft'] = false;
    });
    
    rightBtn.addEventListener('mouseup', () => {
        keysPressed['ArrowRight'] = false;
    });
    
    // Movement functions
    function moveLeft() {
        playerPosition = Math.max(10, playerPosition - 5);
        updatePlayerPosition();
    }
    
    function moveRight() {
        playerPosition = Math.min(90, playerPosition + 5);
        updatePlayerPosition();
    }
    
    function updatePlayerPosition() {
        playerCar.style.left = `${playerPosition}%`;
    }
    
    // Game functions
    function startGame() {
        // Reset game state
        gameRunning = true;
        score = 0;
        scoreDisplay.textContent = score;
        gameOverDisplay.style.display = 'none';
        startBtn.style.display = 'none';
        
        // Clear existing obstacles and coins
        document.querySelectorAll('.obstacle, .coin').forEach(el => el.remove());
        
        // Reset player position
        playerPosition = 50;
        updatePlayerPosition();
        
        // Start game loops
        obstacleInterval = setInterval(createObstacle, 2000);
        coinInterval = setInterval(createCoin, 3000);
        roadAnimation = requestAnimationFrame(animateRoad);
        
        // Game speed increases over time
        gameSpeed = 5;
        obstacleSpeed = 5;
        
        // Start difficulty increase
        setTimeout(increaseDifficulty, 10000);
    }
    
    function endGame() {
        gameRunning = false;
        clearInterval(obstacleInterval);
        clearInterval(coinInterval);
        cancelAnimationFrame(roadAnimation);
        gameOverDisplay.style.display = 'block';
        startBtn.style.display = 'block';
        
        // Update high score
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = highScore;
            localStorage.setItem('highScore', highScore);
        }
    }
    
    function animateRoad() {
        if (!gameRunning) return;
        
        // Move obstacles
        document.querySelectorAll('.obstacle').forEach(obstacle => {
            const top = parseInt(obstacle.style.top) || 0;
            obstacle.style.top = `${top + obstacleSpeed}px`;
            
            // Remove if off screen
            if (top > road.offsetHeight) {
                obstacle.remove();
            }
            
            // Check collision
            if (checkCollision(playerCar, obstacle)) {
                endGame();
            }
        });
        
        // Move coins
        document.querySelectorAll('.coin').forEach(coin => {
            const top = parseInt(coin.style.top) || 0;
            coin.style.top = `${top + gameSpeed}px`;
            
            // Remove if off screen
            if (top > road.offsetHeight) {
                coin.remove();
            }
            
            // Check collection
            if (checkCollision(playerCar, coin)) {
                score += 10;
                scoreDisplay.textContent = score;
                coin.remove();
            }
        });
        
        roadAnimation = requestAnimationFrame(animateRoad);
    }
    
    function createObstacle() {
        if (!gameRunning) return;
        
        const obstacle = document.createElement('div');
        obstacle.className = 'obstacle';
        
        // Random position
        const left = Math.floor(Math.random() * 80) + 10;
        obstacle.style.left = `${left}%`;
        obstacle.style.top = '-100px';
        
        road.appendChild(obstacle);
    }
    
    function createCoin() {
        if (!gameRunning) return;
        
        const coin = document.createElement('div');
        coin.className = 'coin';
        
        // Random position
        const left = Math.floor(Math.random() * 80) + 10;
        coin.style.left = `${left}%`;
        coin.style.top = '-30px';
        
        road.appendChild(coin);
    }
    
    function checkCollision(player, element) {
        const playerRect = player.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        
        return !(
            playerRect.right < elementRect.left || 
            playerRect.left > elementRect.right || 
            playerRect.bottom < elementRect.top || 
            playerRect.top > elementRect.bottom
        );
    }
    
    function increaseDifficulty() {
        if (!gameRunning) return;
        
        gameSpeed += 1;
        obstacleSpeed += 1;
        
        // Continue increasing difficulty
        setTimeout(increaseDifficulty, 10000);
    }
});