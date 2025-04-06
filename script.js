
let GAME_STARTED = false;
let GAME_OVER = false;

let PLAY_ANIMATION = false;
let ANIMATION_FINISHED = false;

let GRADIENT_OFFSET = 0;
let WALLS_OFFSET = 0;

let TITLE_ALPHA = 1;

// Track key states
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const character = new Character(
    canvas.width / 2, canvas.height / 2,
    canvas.width / 2 - 640 / 2 + 20, canvas.width / 2 + 640 / 2 - 20);

const speedControler = new SpeedControler();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Add keyboard event listeners
window.addEventListener("keydown", (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
    }

    if (e.code === "Space" && !PLAY_ANIMATION) {
        PLAY_ANIMATION = true;
        speedControler.reset();
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});


const score = new Score();
const endgame = new Endgame();
setInterval(() => {
    score.calculateTime();
}, 1000);

const ANIMATED_PLAYER_DATA = {
    x: window.innerWidth / 2 - 640 / 2 + 128,
    y: window.innerHeight / 2 - 32,
    vx: 0,
    vy: -5,
    ax: 0.05,
    ay: 0.2,
    angleDir: -1,
};

let HAND_ANGLE = 0;
let HAND_DISTANCE = 0;

const drawGradientRect = (x, y, w, h, stops) => {
    const grad = ctx.createLinearGradient(0, y, 0, y + h);
    stops.forEach(([pos, color]) => grad.addColorStop(pos, color));
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
};

const drawIntro = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = window.innerWidth / 2 - 640 / 2;

    drawGradientRect(centerX, 0, 640, window.innerHeight / 2, [
        [0, SKY_GRADIENT_COLOR_1],
        [1, SKY_GRADIENT_COLOR_2],
    ]);

    drawGradientRect(centerX, window.innerHeight / 2 - GRADIENT_OFFSET, 640, window.innerHeight, [
        [0, BACKGROUND_GRADIENT_COLOR_1],
        [1, BACKGROUND_GRADIENT_COLOR_2],
    ]);

    const drawWall = (obj, startX) => {
        ctx.drawImage(obj, startX, window.innerHeight / 2 - WALLS_OFFSET - 8, 128*1.5, 256*1.5);
    };

    drawWall(leftWall, window.innerWidth / 2 - 640 / 2);
    drawWall(rightWall, window.innerWidth / 2 + 640 / 2 - 128*1.5);

    ctx.fillStyle = "#ff0000";
    ctx.drawImage(playerBody, ANIMATED_PLAYER_DATA.x, ANIMATED_PLAYER_DATA.y, 64, 64);

    var leftHandX;
    var leftHandY;
    var rightHandX;
    var rightHandY;

    if (PLAY_ANIMATION) {
        leftHandX = ANIMATED_PLAYER_DATA.x - 32 + Math.cos(HAND_ANGLE) * HAND_DISTANCE;
        leftHandY = ANIMATED_PLAYER_DATA.y - 32 + Math.sin(HAND_ANGLE) * HAND_DISTANCE;

        rightHandX = ANIMATED_PLAYER_DATA.x + 32 + Math.cos(HAND_ANGLE + Math.PI) * HAND_DISTANCE;
        rightHandY = ANIMATED_PLAYER_DATA.y - 32 + Math.sin(HAND_ANGLE + Math.PI) * HAND_DISTANCE;
    } else {
        leftHandX = ANIMATED_PLAYER_DATA.x;
        leftHandY = ANIMATED_PLAYER_DATA.y + 16;

        rightHandX = ANIMATED_PLAYER_DATA.x + 64;
        rightHandY = ANIMATED_PLAYER_DATA.y + 16;
    }

    ctx.lineWidth = 8;

    ctx.beginPath();
    ctx.moveTo(ANIMATED_PLAYER_DATA.x - 24 + 32, ANIMATED_PLAYER_DATA.y + 32);
    ctx.lineTo(leftHandX, leftHandY);
    ctx.strokeStyle = "#612514";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ANIMATED_PLAYER_DATA.x + 24 + 32, ANIMATED_PLAYER_DATA.y + 32);
    ctx.lineTo(rightHandX, rightHandY);
    ctx.strokeStyle = "#612514";
    ctx.stroke();

    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(ANIMATED_PLAYER_DATA.x - 24 + 32, ANIMATED_PLAYER_DATA.y + 32);
    ctx.lineTo(leftHandX, leftHandY);
    ctx.strokeStyle = "#f5bf2f";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ANIMATED_PLAYER_DATA.x + 24 + 32, ANIMATED_PLAYER_DATA.y + 32);
    ctx.lineTo(rightHandX, rightHandY);
    ctx.strokeStyle = "#f5bf2f";
    ctx.stroke();

    ctx.save();
    ctx.translate(leftHandX, leftHandY);
    ctx.rotate(HAND_ANGLE);
    ctx.drawImage(leftHand, -16, -16, 32, 32);
    ctx.restore();

    ctx.save();
    ctx.translate(rightHandX, rightHandY);
    ctx.rotate(HAND_ANGLE);
    ctx.drawImage(rightHand, -16, -16, 32, 32);
    ctx.restore();

    if (ANIMATED_PLAYER_DATA.y > window.innerHeight + 64) ANIMATION_FINISHED = true;

    clouds.forEach(cloud => {
        cloud.update();
        if (PLAY_ANIMATION) {
            cloud.lowerAlpha();
        }
        cloud.draw();
    });

    ctx.globalAlpha = TITLE_ALPHA;
    ctx.drawImage(gameTitle, window.innerWidth / 2 - (77*4)/2, 64, 77*4, 32*4);

    ctx.fillStyle = "#000000";
    ctx.font = "24px serif";
    const description = "(press space to start)";
    ctx.fillText(description, window.innerWidth / 2 - ctx.measureText(description).width / 2, 216);
    ctx.globalAlpha = 1;
};

class Cloud {
    constructor() {
        const centerX = window.innerWidth / 2;
        this.size = 96;
        this.x = Math.random() * (640 - this.size) + (centerX - 640 / 2 + this.size);
        this.y = Math.random() * 256;
        this.speed = Math.random() * 0.5 + 0.2;
        this.targetAlpha = Math.random();
        this.alpha = 0;

        this.imgSrc = new Image(32, 32);
        this.imgSrc.src = "res/cloud-highres.png";
    }

    raiseAlpha() {
        if (this.alpha < this.targetAlpha) {
            this.alpha += 0.01;
        }
    }

    lowerAlpha() {
        if (this.alpha > 0) {
            this.alpha -= 0.01;
        }
    }

    update() {
        this.x += this.speed;
        const centerX = window.innerWidth / 2;
        const rightBoundary = centerX + 640 / 2 - this.size;
        if (this.x > rightBoundary - this.size) {
            this.lowerAlpha();
        }
        else if (!PLAY_ANIMATION) {
            this.raiseAlpha();
        }
        if (this.x > rightBoundary && !PLAY_ANIMATION) {
            this.x = Math.random() * (640 - this.size) + (centerX - 640 / 2 + this.size);
            this.y = Math.random() * 256;
            this.alpha = 0;
        }
    }

    draw() {
        if(this.alpha < 0) {
            this.alpha = 0;
        }
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.imgSrc, this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

const clouds = [];
for (let i = 0; i < 10; i++) {
    clouds.push(new Cloud());
}


async function drawEndgame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = window.innerWidth / 2 - 640 / 2;

    drawGradientRect(centerX, 0, 640, window.innerHeight / 2, [
        [0, SKY_GRADIENT_COLOR_1],
        [1, SKY_GRADIENT_COLOR_2],
    ]);

    drawGradientRect(centerX, window.innerHeight / 2, 640, window.innerHeight, [
        [0, BACKGROUND_GRADIENT_COLOR_1],
        [1, BACKGROUND_GRADIENT_COLOR_2],
    ]);

    ctx.fillStyle = "#000000";
    ctx.font = "48px serif";

    const title = "Game Over";
    ctx.fillText(title, window.innerWidth / 2 - ctx.measureText(title).width / 2, 64);

    // TODO: use actual score here
    const finalScore = score.formatTime(score.getFinalScore());
    const scoreText = `Your Score: ${finalScore}`;
    ctx.font = "36px serif";
    ctx.fillText(scoreText, window.innerWidth / 2 - ctx.measureText(scoreText).width / 2, 150)

    const inputText = 'Ranking';
    ctx.font = "32px serif";
    ctx.fillText(inputText, window.innerWidth / 2 - ctx.measureText(inputText).width / 2, 220);

    // print ranking
    ctx.font = "24px serif";

    const ranking = endgame.getTop5Ranking();

    if (ranking.length < 5) {
        for (let counter = 0; counter < 5; counter++) {
            if (typeof ranking[counter] === 'undefined') {
                ranking[counter] = {};
                ranking[counter].username = '-';
                ranking[counter].score = 0;
            }
        }
    }

    let userHeight = 300;
    for (let user of ranking) {
        ctx.fillText(user.username, window.innerWidth / 2 - 200, userHeight);
        ctx.fillText(score.formatTime(user.score), window.innerWidth / 2 + 100, userHeight);
        userHeight+=40;
    }

    /*
    ctx.font = "24px serif";
    const description = "(press space to play again)";
    ctx.fillText(description, window.innerWidth / 2 - ctx.measureText(description).width / 2, 216);
    */

    ctx.drawImage(leftWall, window.innerWidth/2 - BACKGROUND_WIDTH/2, window.innerHeight/2, 128*1.5, 256*1.5);
    ctx.drawImage(rightWall, window.innerWidth/2 + BACKGROUND_WIDTH/2 - 128*1.5, window.innerHeight/2, 128*1.5, 256*1.5);
}

function resetGameState() {
    GAME_STARTED = false;
    GAME_OVER = false;
    PLAY_ANIMATION = false;
    ANIMATION_FINISHED = false;
    GRADIENT_OFFSET = 0;
    WALLS_OFFSET = 0;
    TITLE_ALPHA = 1;
}

function update() {
    if (!GAME_STARTED) {
        drawIntro();

        if (!ANIMATION_FINISHED) {
            if (PLAY_ANIMATION) {
                ANIMATED_PLAYER_DATA.vx += ANIMATED_PLAYER_DATA.ax * ANIMATED_PLAYER_DATA.angleDir;
                ANIMATED_PLAYER_DATA.vy += ANIMATED_PLAYER_DATA.ay;
                ANIMATED_PLAYER_DATA.x -= ANIMATED_PLAYER_DATA.vx;
                ANIMATED_PLAYER_DATA.y += ANIMATED_PLAYER_DATA.vy;

                HAND_ANGLE += 0.05;
                HAND_DISTANCE = 50 + Math.sin(HAND_ANGLE) * 20;
            }
        } else {
            TITLE_ALPHA = Math.max(0, TITLE_ALPHA - 0.02);
            GRADIENT_OFFSET = Math.min(window.innerHeight / 2, GRADIENT_OFFSET + 10);
            WALLS_OFFSET = Math.min(window.innerHeight, WALLS_OFFSET + 10);
            if (WALLS_OFFSET === window.innerHeight) {
                GAME_STARTED = true;
                score.resetTime();
            }
        }
    }
    else {
        if (!GAME_OVER) {
            draw();

            character.update();
            getActiveObstacles().forEach((shape) => {
                character.updateByCollision(shape);
            });
            if (character.hasCollision) {
                GAME_OVER = true;
                const endInput = document.getElementsByClassName('endgame-input')[0];
                endInput.style.visibility = 'visible';
            }
        }
        else {
            score.saveTime();
            endgame.setFinalScore(score.getFinalScore());
            drawEndgame();
        }
    }

    requestAnimationFrame(update);
}

function renderScore(width) {
    ctx.font = "50px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(score.getTime(), width + 150, 70);
}

function renderCharacter() {
    character.draw();
}

function drawBackground() {
    const grad2 = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
    grad2.addColorStop(0, BACKGROUND_GRADIENT_COLOR_1);
    grad2.addColorStop(1, BACKGROUND_GRADIENT_COLOR_2);

    ctx.globalAlpha = 1.0;
    ctx.fillStyle = grad2;
    ctx.fillRect(window.innerWidth / 2 - 640 / 2, 0, 640, window.innerHeight);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const increaseSpeedAmount = speedControler.getIncreaseAmount();

    drawBackground();
    increaseLayerSpeed(increaseSpeedAmount);
    handleLayers();
    renderCharacter();
    renderScore(window.innerWidth / 2);
}

requestAnimationFrame(update);
