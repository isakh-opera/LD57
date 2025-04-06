var activeLayer = 0;

function drawLayer(layer) {
    layer.draw(ctx);
}

// =========================
// Layer Generation
// =========================

function generateLayer() {
    var layer = new Layer([]);

    const obstacleAmount = delta(1, 10);
    for (let i = 0; i < obstacleAmount; i++) {
        const x = window.innerWidth / 2 + delta(-BACKGROUND_WIDTH / 2 + SHAPE_WIDTH / 2, BACKGROUND_WIDTH / 2 - SHAPE_WIDTH / 2);
        const y = delta(window.innerHeight - 300, window.innerHeight) + 300;

        layer.shapes.push(
            new Shape(
                x,
                y,
                SHAPE_WIDTH,
                SHAPE_WIDTH,
                SHAPE_COLOR,
                true
            )
        );
    }

    return layer;
}

// =========================
// Layer Initialization
// =========================

var layers = [
    generateLayer(),
    generateLayer(),
    generateLayer()
];

// =========================
// Layer Handling & Input
// =========================

/**
 * Handles switching between layers and rendering them with opacity.
 */
function handleLayers() {
    var maxLayer = layers.length - 1;

    if (keyboard.isArrowDown() && activeLayer > 0) {
        activeLayer--;
    } else if (keyboard.isArrowUp() && activeLayer < maxLayer) {
        activeLayer++;
    }

    // Draw all layers with opacity based on distance from the active layer
    for (let i = 0; i < layers.length; i++) {
        const diff = difference(activeLayer, i);
        layers[i].alpha = 1.0 - diff * 0.4;
        drawLayer(layers[i]);
    }
}

/**
 * Increases the speed of all layers by a given delta.
 */
function increaseLayerSpeed(delta) {
    layers.forEach(layer => {
        layer.increaseSpeed(delta); 
    });
}

/**
 * Retuen obstabcles on the current active layer
 */
function getActiveObstacles() {
    return layers[activeLayer].shapes;
}
