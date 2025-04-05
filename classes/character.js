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
            ctx.fillStyle = "#FF0000";
            this.blocks[i].draw();
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
            if(block instanceof BlockCircle && obstacle instanceof BlockCircle) {
                if (checkCollisionBetweenCircleAndCircle(block, obstacle)) {
                    console.log('collision circle and circle');
                    return true;
                }
            } else if(block instanceof BlockCircle && obstacle instanceof BlockRectangle) {
                if (checkCollisionBetweenCircleAndRect(block, obstacle)) {
                    console.log('collision circle and rect');
                    return true;
                }
            } else if(block instanceof BlockCircle && obstacle instanceof BlockPolygon) {
                if (checkCollisionBetweenCircleAndPolygon(block, obstacle)) {
                    console.log('collision circle and polygon');
                    return true;
                }
            }

            if (block instanceof BlockRectangle && obstacle instanceof BlockCircle) {
                if (checkCollisionBetweenCircleAndRect(obstacle, block)) {
                    console.log('collision rect and circle');
                    return true;
                }
            }

            if (block instanceof BlockRectangle && obstacle instanceof BlockRectangle) {
                if (checkCollisionBetweenRectAndRect(block, obstacle)) {
                    console.log('collision rect and rect');
                    return true;
                }
            }

            if (block instanceof BlockRectangle && obstacle instanceof BlockPolygon) {
                if (checkCollisionBetweenRectAndPolygon(block, obstacle)) {
                    console.log('collision rect and polygon');
                    return true;
                }
            }

            if (block instanceof BlockPolygon && obstacle instanceof BlockCircle) {
                if (checkCollisionBetweenCircleAndPolygon(obstacle, block)) {
                    console.log('collision polygon and circle');
                    return true;
                }
            }

            if (block instanceof BlockPolygon && obstacle instanceof BlockRectangle) {
                if (checkCollisionBetweenRectAndPolygon(obstacle, block)) {
                    console.log('collision polygon and rect');
                    return true;
                }
            }

            if (block instanceof BlockPolygon && obstacle instanceof BlockPolygon) {
                if (checkCollisionBetweenPolygonAndPolygon(block, obstacle)) {
                    console.log('collision polygon and polygon');
                    return true;
                }
            }
        }
        return false;
    }
}
