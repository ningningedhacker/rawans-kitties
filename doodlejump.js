let board, context;
let boardWidth = 360, boardHeight = 576;
let doodlerWidth = 46, doodlerHeight = 46;
let doodlerX = boardWidth / 2 - doodlerWidth / 2, doodlerY = boardHeight * 7 / 8 - doodlerHeight;
let platformImg;
let velocityX = 0, velocityY = 0, initialVelocityY = -8, gravity = 0.4;
let platformArray = [], platformWidth = 60, platformHeight = 36;
let score = 0, maxScore = 0, gameOver = false;
let highscore = localStorage.getItem("highScore") || 0;
let isPaused = false, animationFrameId;
let pauseOverlay;

let doodler = {
    img: null,
    x: doodlerX,
    y: doodlerY,
    width: doodlerWidth,
    height: doodlerHeight
};

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    platformImg = new Image();
    platformImg.src = "Untitled__3_-removebg-preview.png";

    velocityY = initialVelocityY;

    loadSavedCharacter();
    document.getElementById('pause-btn').addEventListener('click', togglePause);
    startGame(); // Start game loop after loading everything
    document.addEventListener("keydown", moveDoodler);
    document.addEventListener("keyup", stopDoodler);
    document.addEventListener("touchstart", moveDoodler);
    document.addEventListener("touchend", stopDoodler);
};

function loadSavedCharacter() {
    const characters = [
        'Untitled__1_-removebg-preview (1).png', // Path to Character 1 image
        'cutecat.png', // Path to Character 2 image
        'Dibujos_animados_de_un_lindo_gato_naranja_sentado___Vector_Premium-removebg-preview (1).png'  // Path to Character 3 image
    ];

    const savedIndex = localStorage.getItem('selectedCharacterIndex');
    const characterImg = new Image();
    if (savedIndex !== null) {
        characterImg.src = characters[parseInt(savedIndex)];
    } else {
        characterImg.src = characters[0];
    }
    doodler.img = characterImg;
    doodler.img.onload = function() {
        resetGame(); // Ensure reset is called after image is fully loaded
    };
}

function update() {
    if (!isPaused) {
        if (gameOver) {
            return;
        }

        context.clearRect(0, 0, board.width, board.height);

        for (let i = 0; i < platformArray.length; i++) {
            let platform = platformArray[i];
            if (velocityY < 0 && doodler.y < boardHeight * 3 / 4) {
                platform.y -= initialVelocityY;
            }
            if (detectCollision(doodler, platform) && velocityY >= 0) {
                velocityY = initialVelocityY;
            }
            context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
        }

        while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
            platformArray.shift();
            newPlatform();
        }

        doodler.x += velocityX;
        if (doodler.x > boardWidth) {
            doodler.x = 0;
        } else if (doodler.x + doodler.width < 0) {
            doodler.x = boardWidth;
        }

        velocityY += gravity;
        doodler.y += velocityY;
        if (doodler.y > board.height) {
            gameOver = true;
        }
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

        updateScore();
        context.fillStyle = "white";
        context.font = "16px sans-serif";
        context.shadowColor = 'black';
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.shadowBlur = 5;
        context.fillText("Score: " + score, 15, 27);
        context.fillText("High Score: " + highscore, boardWidth * 2 / 5, 27);

        if (gameOver) {
            context.fillText("Game Over: Press 'Space' to Restart", boardWidth / 7, boardHeight * 7 / 8);
        }
    }
    animationFrameId = requestAnimationFrame(update);
}

function moveDoodler(e) {
    if (e.code === "ArrowRight" || e.code === "KeyD") {
        velocityX = 4;
    } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        velocityX = -4;
    } else if ((e.code === "Space" && gameOver) || (e.type === "touchstart" && gameOver)) {
        resetGame();
    } else if (e.type === "touchstart") {
        const touchX = e.touches[0].clientX;
        velocityX = touchX < window.innerWidth / 2 ? -4 : 4;
    }
}

function stopDoodler(e) {
    if (e.type === "keyup" || e.type === "touchend") {
        velocityX = 0;
    }
}

function placePlatforms() {
    platformArray = [];
    let platform = {
        img: platformImg,
        x: boardWidth / 2,
        y: boardHeight - 50,
        width: platformWidth,
        height: platformHeight
    }
    platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth * 3 / 4);
        platform = {
            img: platformImg,
            x: randomX,
            y: boardHeight - 75 * i - 150,
            width: platformWidth,
            height: platformHeight
        }
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth * 3 / 4);
    let platform = {
        img: platformImg,
        x: randomX,
        y: -platformHeight,
        width: platformWidth,
        height: platformHeight
    }
    platformArray.push(platform);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function updateScore() {
    let points = Math.floor(50 * Math.random());
    if (velocityY < 0) {
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    } else if (velocityY >= 0) {
        maxScore -= points;
    }
    if (score > highscore) {
        highscore = score;
        localStorage.setItem("highScore", highscore);
    }
}

function resetGame() {
    doodler.x = doodlerX;
    doodler.y = doodlerY;

    velocityX = 0;
    velocityY = initialVelocityY;
    score = 0;
    maxScore = 0;
    gameOver = false;
    placePlatforms();
    isPaused = false;
    cancelAnimationFrame(animationFrameId)
    startGame();
}

function startGame() {
    animationFrameId = requestAnimationFrame(update);

}

function pauseGame() {
    cancelAnimationFrame(animationFrameId);
}

function togglePause() {
    let pauseOverlay = document.getElementById('pause-overlay');
    if (isPaused) {
        document.getElementById('pause-btn').innerHTML = '<img src="211791_pause_icon.png" alt="Pause">';
        if (pauseOverlay) {
            pauseOverlay.style.display = 'none';
        }
        startGame();
    } else {
        document.getElementById('pause-btn').innerHTML = '';
        showPauseOverlay();
        pauseGame();
    }
    isPaused = !isPaused;
}
// doodlejump.js

// Other existing code...

function showPauseOverlay() {
    let pauseOverlay = document.getElementById('pause-overlay');
    if (!pauseOverlay) {
        pauseOverlay = document.createElement('div');
        pauseOverlay.id = 'pause-overlay';
        pauseOverlay.style.position = 'absolute';
        pauseOverlay.style.top = '0';
        pauseOverlay.style.left = '0';
        pauseOverlay.style.width = '100%';
        pauseOverlay.style.height = '100%';
        pauseOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        pauseOverlay.style.color = '#fff';
        pauseOverlay.style.display = 'flex';
        pauseOverlay.style.justifyContent = 'center';
        pauseOverlay.style.alignItems = 'center';
        pauseOverlay.innerHTML = `
            <div style="background-color: lightgreen; border-radius: 8px; padding: 20px; text-align: center; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);">
                <h2 style="margin-bottom: 20px; font-family:arial;">Paused</h2>
                <button onclick="resumeGame()" style="padding: 10px 20px; margin-right: 10px; background-color: rgb(79, 211, 255); color: #fff; border: none; border-radius: 4px; cursor: pointer;">Resume</button>
                <button onclick="quitGame()" id="quit" style="padding: 10px 20px; background-color: tomato; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Quit</button>
            </div>
        `;
        document.body.appendChild(pauseOverlay);
    } else {
        pauseOverlay.style.display = 'flex';
    }
}
// Other existing code...

function togglePause() {
    let pauseOverlay = document.getElementById('pause-overlay');
    if (isPaused) {
        document.getElementById('pause-btn').innerHTML = '<img src="211791_pause_icon.png" alt="Pause">';
        if (pauseOverlay) {
            pauseOverlay.style.display = 'none';
        }
        startGame();
    } else {
        document.getElementById('pause-btn').innerHTML = '';
        showPauseOverlay();
        pauseGame();
    }
    isPaused = !isPaused;
}

// Other existing code...



function resumeGame() {
    document.getElementById('pause-btn').innerHTML = '<img src="211791_pause_icon.png" alt="Pause">';
    document.getElementById('pause-overlay').style.display = 'none';
    startGame();
    isPaused = false;
}

function quitGame() {
    window.location.href = "index.html"; // Redirect to the main page
}
