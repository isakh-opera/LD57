class Character {
    constructor(x, y, boundaryLeft, boundaryRight) {
        this.x = x;
        this.y = y;
        this.xradius = 25;
        this.yradius = 16;
        this.speed = 10;
        this.boundaryLeft = boundaryLeft;
        this.boundaryRight = boundaryRight;
        this.hasCollision = false;
        this.blocks = [];
        this.initBlocks();

        // TODO(isakh): Improve how this is handled
        this.playerSprite = new Image(64, 64);
        this.playerSprite.src = "./res/player-highres.png";

        this.leftHand = new Image(32, 32);
        this.leftHand.src = "./res/hand-left.png";

        this.rightHand = new Image(32, 32);
        this.rightHand.src = "./res/hand-right.png";

        this.handAngle = 0;
        this.handDistance = 0;
    }

    initBlocks() {
        this.blocks.push(new BlockEllipse(this.x, this.y, this.xradius, this.yradius));
    }

    update() {
        if (this.hasCollision) {
            return;
        }

        // TODO(isakh): Improve how this is handled
        this.handAngle += 0.05;
        this.handDistance = 50 + Math.sin(this.handAngle) * 20;

        let dx = 0;
        if (getKeyboard().isArrowLeftWithoutDebounce() && this.x > this.boundaryLeft) {
            dx = -this.speed;
        }
        if (getKeyboard().isArrowRightWithoutDebounce() && this.x < this.boundaryRight) {
            dx = this.speed;
        }

        for (let block of this.blocks) {
            block.updateX(dx);
        }

        this.x += dx;
        this.x = Math.max(this.boundaryLeft, Math.min(this.x, this.boundaryRight));
    }

    draw() {
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = "#FF0000";

        // TODO(isakh): Improve how this is handled
        ctx.drawImage(this.playerSprite, this.x - 32, this.y - 32, 64, 64);
        const leftHandX = this.x - 32 + Math.cos(this.handAngle) * this.handDistance;
        const leftHandY = this.y - 32 + 16 + Math.sin(this.handAngle) * this.handDistance;
        const rightHandX = this.x + 32 + Math.cos(this.handAngle + Math.PI) * this.handDistance;
        const rightHandY = this.y - 32 + 16 + Math.sin(this.handAngle + Math.PI) * this.handDistance;

        ctx.lineWidth = 8;

        ctx.beginPath();
        ctx.moveTo(this.x - 24, this.y);
        ctx.lineTo(leftHandX, leftHandY);
        ctx.strokeStyle = "#612514";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.x + 24, this.y);
        ctx.lineTo(rightHandX, rightHandY);
        ctx.strokeStyle = "#612514";
        ctx.stroke();

        ctx.lineWidth = 4;

        ctx.beginPath();
        ctx.moveTo(this.x - 24, this.y);
        ctx.lineTo(leftHandX, leftHandY);
        ctx.strokeStyle = "#f5bf2f";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.x + 24, this.y);
        ctx.lineTo(rightHandX, rightHandY);
        ctx.strokeStyle = "#f5bf2f";
        ctx.stroke();

        ctx.save();
        ctx.translate(leftHandX, leftHandY);
        ctx.rotate(this.handAngle);
        ctx.drawImage(leftHand, -16, -16, 32, 32);
        ctx.restore();

        ctx.save();
        ctx.translate(rightHandX, rightHandY);
        ctx.rotate(this.handAngle);
        ctx.drawImage(rightHand, -16, -16, 32, 32);
        ctx.restore();
    }

    updateByCollision(obstacle) {
        if (this.hasCollision) {
            return;
        }

        if (this.checkCollision(obstacle)) {
            this.hasCollision = true;
        }
    }

    checkCollision(obstacle) {
        for (let block of this.blocks) {
            // Consider the charactor as an eclipse shape
            const absolutePoints = obstacle.points.reduce((acc, point) => {
                acc.push(point[0], point[1] + obstacle.offset);
                return acc;
            }, []);
            if (Intersects.ellipsePolygon(block.x, block.y, block.xradius, block.yradius, absolutePoints)) {
                return true;
            }
        }
        return false;
    }
}
