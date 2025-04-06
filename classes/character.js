class Character {
    constructor(x, y, boundaryLeft, boundaryRight) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.speed = 16;
        // todo: calculate the boundary based on the canvas size and the character size
        this.boundaryLeft = boundaryLeft;
        this.boundaryRight = boundaryRight;
        this.hasCollision = false;
        this.blocks = [];

        // TODO(isakh): Improve how this is handled
        this.playerSprite = new Image(64, 64);
        this.playerSprite.src = "./res/player-variant.png";

        this.leftHand = new Image(32, 32);
        this.leftHand.src = "./res/hand-left.png";

        this.rightHand = new Image(32, 32);
        this.rightHand.src = "./res/hand-right.png";

        this.handAngle = 0;
        this.handDistance = 0;
    }

    initBlocks() {
        this.blocks.push(new BlockCircle(this.x, this.y, this.radius));
        // this.blocks.push(new BlockRectangle(this.x - 15, this.y + this.radius, 30, 40));
        // this.blocks.push(new BlockRectangle(this.x - 35, this.y + this.radius + 5, 20, 10));
        // this.blocks.push(new BlockRectangle(this.x + 15, this.y + this.radius + 5, 20, 10));
        // this.blocks.push(new BlockRectangle(this.x - 15, this.y + this.radius + 40, 10, 20));
        // this.blocks.push(new BlockRectangle(this.x + 5, this.y + this.radius + 40, 10, 20));
    }

    update() {
        if(this.hasCollision) {
            return;
        }

        // TODO(isakh): Improve how this is handled
        this.handAngle += 0.05;
        this.handDistance = 50 + Math.sin(this.handAngle) * 20;

        let dx = 0;
        if(keys.ArrowLeft && this.x > this.boundaryLeft) {
            dx = -this.speed;
        }
        if(keys.ArrowRight && this.x < this.boundaryRight) {
            dx = this.speed;
        }

        for(let block of this.blocks) {
            block.updateX(dx);
        }

        this.x += dx;
        this.x = Math.max(this.boundaryLeft, Math.min(this.x, this.boundaryRight));
    }

    draw() {
        for(let i = 0; i < this.blocks.length; i++) {
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = "#FF0000";
            this.blocks[i].draw();

            // TODO(isakh): Improve how this is handled
            ctx.drawImage(this.playerSprite, this.x - 32, this.y - 32, 64, 64);
            const leftHandX = this.x - 32 + Math.cos(this.handAngle) * this.handDistance;
            const leftHandY = this.y - 32 + 16 + Math.sin(this.handAngle) * this.handDistance;
            const rightHandX = this.x + 32 + Math.cos(this.handAngle + Math.PI) * this.handDistance;
            const rightHandY = this.y - 32 + 16 + Math.sin(this.handAngle + Math.PI) * this.handDistance;

            ctx.beginPath();
            ctx.moveTo(this.x - 32 - 24 + 32, this.y - 32 + 32);
            ctx.lineTo(leftHandX, leftHandY);
            ctx.strokeStyle = "#d3b764";
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.x - 32 + 24 + 32, this.y - 32 + 32);
            ctx.lineTo(rightHandX, rightHandY);
            ctx.strokeStyle = "#d3b764";
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
    }

    updateByCollision(obstacle) {
        if(this.hasCollision) {
            return;
        }

        if (this.checkCollision(obstacle)) {
            this.hasCollision = true;
        }
    }

    checkCollision(obstacle) {
        for(let block of this.blocks) {
            const absolutePoints = obstacle.points.reduce((acc, point) => {
                acc.push(point[0], point[1] + polygon.offset);
                return acc;
            }, []);
            if  (Intersects.circlePolygon(block.x, block.y, block.radius, absolutePoints)) {
                return true;
            }
        }
        return false;
    }
}
