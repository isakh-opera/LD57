var activeLayer = 0;

function drawLayer(layer) {
    layer.draw(ctx);
}

function generateLayer(obstacleAmount, xOffset, yOffset) {
    layer = new Layer([])

    for (let i = 0; i < obstacleAmount; i++) {
        layer.shapes.push(
            new Shape(
                window.innerWidth / 2 + xOffset,
                delta(yOffset-300,yOffset)+300,
                SHAPE_WIDTH,
                SHAPE_WIDTH,
                SHAPE_COLOR,
                true
            )
        )
    }

    return layer;
}

var layers = [
    generateLayer(1, -BACKGROUND_WIDTH/2 + SHAPE_WIDTH/2, window.innerHeight),
    generateLayer(1, 0, window.innerHeight),
    generateLayer(1,  BACKGROUND_WIDTH/2 - SHAPE_WIDTH/2, window.innerHeight),
];

function handleLayers() {
    var maxLayer = layers.length - 1;
    if (keyboard.key == "ArrowDown") {
        if (activeLayer != 0) {
            activeLayer--;
        }
        keyboard.key = null;
    } else if (keyboard.key == "ArrowUp") {
        if (activeLayer != maxLayer) {
            activeLayer++;
        }
        keyboard.key = null;
    }

    for (let i = 0; i < layers.length; i++) {
        const diff = difference(activeLayer, i);
        const alpha = 1.0 - diff * 0.4;
        layers[i].alpha = alpha
        drawLayer(layers[i]);
    }
}

function delta(min, max) {
    return Math.random() * (max - min) + min;
}