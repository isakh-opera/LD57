class Shape {
    constructor(x, y, height, width, color, obstacle) {
        this.x = x;
        this.y = y;
        this.worldX= x;
        this.worldY= y;
        this.height = height;
        this.width = width;
        this.color = color;
        this.alpha = 1.0;
        this.generatePoints(obstacle);
        this.createdNext = false;
        this.offset = 0;
        this.offsetSpeed = 2;
    }

    increaseSpeed(delta) {
        this.offsetSpeed += delta;
    }

    // mviana:
    // status: rock format points
    generatePoints(obstacle){
        if (obstacle === true){
            this.points = [];
            
            // create a regular polygon
            const numSides = 16;
            const deltaMaxScale = 5;

            // scale the size of the rock
            const height = (this.height/2) * this.delta(0.5,1);
            const width = (this.width/2) * this.delta(0.5,1);
            
            for (let i = 0; i < numSides; i++) {
                const angle = (2 * Math.PI * i) / numSides;
                const x = this.x + width * Math.cos(angle);
                const y = this.y + height * Math.sin(angle);
                const deltaX = this.delta(-width/deltaMaxScale,width/deltaMaxScale)
                const deltaY = this.delta(-height/deltaMaxScale,height/deltaMaxScale)
                this.points.push([x+deltaX , y+deltaY])
            }
        
            return;
        }
        
        // background:
        this.points = [
            [this.x, this.y], // top left
            [this.x + this.width, this.y], // top right
            [this.x + this.width, this.y + this.height], // bottom right
            [this.x, this.y + this.height], // bottom left
        ];
    }

    delta(min, max) {
        return Math.random() * (max - min) + min;
    }

    draw(context) {
        context.fillStyle = this.color;
        context.beginPath();

        context.globalAlpha = this.alpha;

        context.moveTo(this.points[0][0], this.points[0][1]);
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            context.lineTo(point[0], point[1]);
        }

        context.closePath();
        context.fill();
    }

    drawWithOffset(context) {
        context.fillStyle = this.color;
        context.beginPath();

        context.globalAlpha = this.alpha;

        context.moveTo(this.points[0][0], this.points[0][1] + this.offset);
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            context.lineTo(point[0], point[1] + this.offset);
        }

        context.closePath();
        context.fill();

        this.worldY = this.y + this.offset;

        this.offset -= this.offsetSpeed;
    }
}
