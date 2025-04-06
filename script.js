let GAME_STARTED = false;
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

// Add keyboard event listeners
window.addEventListener("keydown", (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
    }

    if (e.code === "Space" && !PLAY_ANIMATION) PLAY_ANIMATION = true;
});

window.addEventListener("keyup", (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const character = new Character(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 640 / 2 + 20, canvas.width / 2 + 640 / 2 - 20);
character.initBlocks();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const score = new Score();
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

const playerBody = new Image(64, 64);
playerBody.src = "res/player-variant.png";

const leftHand = new Image(32, 32);
leftHand.src = "res/hand-left.png";

const rightHand = new Image(32, 32);
rightHand.src = "res/hand-right.png";

const rightWall = new Image(256, 1024);
rightWall.src = "res/right-wall.png";

const leftWall = new Image(256, 1024);
leftWall.src = "res/left-wall.png";

let HAND_ANGLE = 0;
let HAND_DISTANCE = 0;

const drawIntro = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawGradientRect = (x, y, w, h, stops) => {
        const grad = ctx.createLinearGradient(0, y, 0, y + h);
        stops.forEach(([pos, color]) => grad.addColorStop(pos, color));
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);
    };

    const centerX = window.innerWidth / 2 - 640 / 2;

    drawGradientRect(centerX, 0, 640, window.innerHeight / 2, [
        [0, "#D5F3FE"],
        [1, "#1E88E5"],
    ]);

    drawGradientRect(centerX, window.innerHeight / 2 - GRADIENT_OFFSET, 640, window.innerHeight, [
        [0, "gray"],
        [1, "black"],
    ]);

    const drawWall = (obj, startX, direction) => {
        ctx.fillStyle = "gray";
        /*
        ctx.beginPath();
        ctx.moveTo(startX, window.innerHeight / 2 - WALLS_OFFSET);
        ctx.lineTo(startX + 172 * direction, window.innerHeight / 2 - WALLS_OFFSET);
        ctx.lineTo(startX, window.innerHeight - WALLS_OFFSET);
        ctx.closePath();
        ctx.fill();
        */
        ctx.drawImage(obj, startX, window.innerHeight / 2 - WALLS_OFFSET - 8, 172, window.innerHeight / 2);
    };

    drawWall(leftWall, window.innerWidth / 2 - 640 / 2, 1);
    drawWall(rightWall, window.innerWidth / 2 + 640 / 2 - 172, -1);

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

    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(ANIMATED_PLAYER_DATA.x - 24 + 32, ANIMATED_PLAYER_DATA.y + 32);
    ctx.lineTo(leftHandX, leftHandY);
    ctx.strokeStyle = "#d3b764";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ANIMATED_PLAYER_DATA.x + 24 + 32, ANIMATED_PLAYER_DATA.y + 32);
    ctx.lineTo(rightHandX, rightHandY);
    ctx.strokeStyle = "#d3b764";
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
        if(PLAY_ANIMATION) {
            cloud.lowerAlpha();
        }
        cloud.draw();
    });

    ctx.globalAlpha = TITLE_ALPHA;
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#d3b764";
    ctx.lineWidth = 4;
    ctx.font = "48px serif";
    const title = "gnoccholini droppotini";
    ctx.strokeText(title, window.innerWidth / 2 - ctx.measureText(title).width / 2, 64);
    ctx.fillText(title, window.innerWidth / 2 - ctx.measureText(title).width / 2, 64);
    ctx.fillStyle = "#000000";
    ctx.font = "32px serif";
    const description = "(press space to start)";
    ctx.fillText(description, window.innerWidth / 2 - ctx.measureText(description).width / 2, 112);
    ctx.globalAlpha = 1;
};

class Cloud {
    constructor() {
        const centerX = window.innerWidth / 2;
        this.size = Math.random() * 50 + 30;
        this.x = Math.random() * (640 - this.size) + (centerX - 640 / 2 + this.size);
        this.y = Math.random() * 256;
        this.speed = Math.random() * 0.5 + 0.2;
        this.targetAlpha = Math.random(); 
        this.alpha = 0;
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
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
    }
}

const clouds = [];
for (let i = 0; i < 10; i++) {
    clouds.push(new Cloud());
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
            if (WALLS_OFFSET === window.innerHeight) GAME_STARTED = true;
        }
    }
    else {
        draw();

        character.update();
        getActiveObstacles().forEach((shape) => {
            character.updateByCollision(shape);
        });
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
    grad2.addColorStop(0, "gray");
    grad2.addColorStop(1, "black");

    ctx.globalAlpha = 1.0;
    ctx.fillStyle = grad2;
    ctx.fillRect(window.innerWidth / 2 - 640 / 2, 0, 640, window.innerHeight);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    handleLayers();
    renderCharacter();
    renderScore(window.innerWidth / 2);
}

requestAnimationFrame(update);
