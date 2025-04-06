var yOffset = 0;
var minY = -10000; // mviana increase to test generate more shapes

class Layer {
    constructor(shapes) {
        this.shapes = shapes;
        this.alpha = 1.0;
        this.offsetSpeed = 2;
    }

    setOffsetSpeed(offsetSpeed) {
        this.offsetSpeed = offsetSpeed;
    }

    increaseSpeed(delta) {
        this.offsetSpeed += delta;

        for (let shape of this.shapes) {
            shape.setOffsetSpeed(this.offsetSpeed);
        }   
    }

    draw(context) {
        let deepestY = 0;

        let createNext = false;
        let removeShape = false;
        for (let i = 0; i < this.shapes.length; i++) {
            let shape = this.shapes[i];
            if (shape.worldY > deepestY){
                deepestY = shape.worldY;
            }
            shape.alpha = this.alpha;
            shape.drawWithOffset(context);

            if (shape.worldY < shape.y /1.5 && !shape.createdNext)  {
                this.shapes[i].createdNext = true;
                createNext = true;
            }

            // mviana: not use 50, use the shape height
            if (!removeShape){
                removeShape = shape.worldY < 0
            }
        }

        if (createNext){
            createNext = false;
            this.shapes.push(
                new Shape(
                    this.shapes[0].x,
                    delta(window.innerHeight-300,window.innerHeight) +300,
                    SHAPE_WIDTH,
                    SHAPE_WIDTH,
                    SHAPE_COLOR,
                    true,
                    this.offsetSpeed
                )
            );
        }

        if (removeShape) {
            removeShape = false;
            this.shapes.shift();
        }

        if (yOffset > minY) {
            yOffset -= 1;
        }
    }
}

function delta(min, max) {
    return Math.random() * (max - min) + min;
}