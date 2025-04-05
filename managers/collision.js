class Block {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        // Default implementation in base class
        throw new Error('Block.draw() must be implemented by subclass');
    }

    updateX(dx) {
        this.x += dx;
    }

    updateY(dy) {
        this.y += dy;
    }
}

class BlockCircle extends Block {
    constructor(x, y, radius) {
        super(x, y);
        this.radius = radius;
        this.dx = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00FF00';
        ctx.fill();
    }
}

class BlockRectangle extends Block {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.points = [
            [0, 0],
            [this.width, 0], 
            [this.width, this.height],
            [0, this.height]
        ]; // relative distance to the start point
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#00FF00';
        ctx.fill(); 
    }
}

class BlockPolygon extends Block {
    constructor(x, y, points) {
        super(x, y);
        this.points = points; // relative distance to the start point
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        for(let point of this.points) {
            ctx.lineTo(this.x + point[0], this.y + point[1]);
        }
        ctx.closePath();
        ctx.fillStyle = '#00FF00';
        ctx.fill();
    } 
}

function checkCollisionBetweenCircleAndCircle(circle1, circle2) {
    return Intersects.circleCircle(circle1.x, circle1.y, circle1.radius, circle2.x, circle2.y, circle2.radius);
}

function checkCollisionBetweenCircleAndRect(circle, rect) {
    return Intersects.circleBox(circle.x, circle.y, circle.radius, rect.x, rect.y, rect.width, rect.height);
}

function checkCollisionBetweenCircleAndPolygon(circle, polygon) {
    const absolutePoints = polygon.points.reduce((acc, point) => {
        acc.push(polygon.x + point[0], polygon.y + point[1]);
        return acc;
    }, []);
    return Intersects.circlePolygon(circle.x, circle.y, circle.radius, absolutePoints);
}

function checkCollisionBetweenRectAndRect(rect1, rect2) {
    return Intersects.boxBox(rect1.x, rect1.y, rect1.width, rect1.height, rect2.x, rect2.y, rect2.width, rect2.height);
}

function checkCollisionBetweenPolygonAndPolygon(poly1, poly2) {
    const absolutePoints1 = poly1.points.reduce((acc, point) => {
        acc.push(poly1.x + point[0], poly1.y + point[1]);
        return acc;
    }, []);
    const absolutePoints2 = poly2.points.reduce((acc, point) => {
        acc.push(poly2.x + point[0], poly2.y + point[1]);
        return acc;
    }, []);
    return Intersects.polygonPolygon(absolutePoints1, absolutePoints2);
}

function checkCollisionBetweenRectAndPolygon(rect, polygon) {
    const absolutePoints = polygon.points.reduce((acc, point) => {
        acc.push(polygon.x + point[0], polygon.y + point[1]);
        return acc;
    }, []);
    return Intersects.boxPolygon(rect.x, rect.y, rect.width, rect.height, absolutePoints);
}
