function difference(a, b) {
    return Math.abs(a - b);
}

function getRandomHexColor() {
    const randomColor = Math.floor(Math.random() * 16777215);
    const hexColor = "#" + randomColor.toString(16).padStart(6, "0");
    return hexColor;
}