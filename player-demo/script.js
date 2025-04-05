const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const playerBody = new Image(64, 64);
playerBody.src = "res/gnocchi.png";

const leftHand = new Image(32, 32);
leftHand.src = "res/hand-left.png";

const rightHand = new Image(32, 32);
rightHand.src = "res/hand-right.png";

let handAngle = 0;
let handDistance = 50;

class Cloud {
    constructor() {
        const centerX = window.innerWidth / 2;
        this.size = Math.random() * 50 + 30;
        this.x = Math.random() * (640 - this.size) + (centerX - 640 / 2 + this.size);
        this.y = Math.random() * 512;
        this.speed = Math.random() * 0.5 + 0.2;
        this.alpha = Math.random();
    }

    update() {
        this.x += this.speed;
        const centerX = window.innerWidth / 2;
        const rightBoundary = centerX + 640 / 2 - this.size;
        if (this.x > rightBoundary) {
            this.x = Math.random() * (640 - this.size) + (centerX - 640 / 2 + this.size);
            this.y = Math.random() * 512;
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

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(window.innerWidth / 2 - 640 / 2, 0, 640, 512);

    clouds.forEach(cloud => {
        cloud.update();
        cloud.draw();
    });

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    ctx.drawImage(playerBody, centerX - 64 / 2, centerY, 64, 64);

    const leftHandX = centerX - 32 + Math.cos(handAngle) * handDistance;
    const leftHandY = centerY - 32 + Math.sin(handAngle) * handDistance;
    
    const rightHandX = centerX + 32 + Math.cos(handAngle + Math.PI) * handDistance;
    const rightHandY = centerY - 32 + Math.sin(handAngle + Math.PI) * handDistance;

    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(centerX - 24, centerY + 32);
    ctx.lineTo(leftHandX, leftHandY);
    ctx.strokeStyle = "#d3b764";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX + 24, centerY + 32);
    ctx.lineTo(rightHandX, rightHandY);
    ctx.strokeStyle = "#d3b764";
    ctx.stroke();

    ctx.save();
    ctx.translate(leftHandX, leftHandY);
    ctx.rotate(handAngle);
    ctx.drawImage(leftHand, -16, -16, 32, 32);
    ctx.restore();

    ctx.save();
    ctx.translate(rightHandX, rightHandY);
    ctx.rotate(handAngle + Math.PI);
    ctx.drawImage(rightHand, -16, -16, 32, 32);
    ctx.restore();
};

const update = () => {
    handAngle += 0.05;
    handDistance = 50 + Math.sin(handAngle) * 20;
    draw();
    requestAnimationFrame(update);
};

requestAnimationFrame(update);
