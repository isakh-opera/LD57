class Block {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    updateX(dx) {
        this.x += dx;
    }

    updateY(dy) {
        this.y += dy;
    }
}

class BlockEllipse extends Block {
    constructor(x, y, xradius, yradius) {
        super(x, y);
        this.xradius = xradius;
        this.yradius = yradius;
        this.dx = 0;
    }
}

class BlockCircle extends Block {
    constructor(x, y, radius) {
        super(x, y);
        this.radius = radius;
        this.dx = 0;
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
}

class BlockPolygon extends Block {
    constructor(x, y, points) {
        super(x, y);
        this.points = points; // relative distance to the start point
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
