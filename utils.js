/**
 * Returns the absolute difference between two numbers.
 * @param {number} a - First number.
 * @param {number} b - Second number.
 * @returns {number} Absolute difference.
 */
function difference(a, b) {
    return Math.abs(a - b);
}

/**
 * Generates a random hex color string.
 * @returns {string} Random hex color in the format '#RRGGBB'.
 */
function getRandomHexColor() {
    const maxColorValue = 0xFFFFFF;
    const randomColor = Math.floor(Math.random() * (maxColorValue + 1));
    return `#${randomColor.toString(16).padStart(6, '0')}`;
}

/**
 * Returns a random floating-point number between min (inclusive) and max (exclusive).
 * @param {number} min - Minimum value (inclusive).
 * @param {number} max - Maximum value (exclusive).
 * @returns {number} Random float between min and max.
 */
function delta(min, max) {
    return Math.random() * (max - min) + min;
}