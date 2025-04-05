function KeyboardManager() {
    this.key = null;
}

let keyboard = new KeyboardManager();

document.addEventListener("keyup", (event) => {
    keyboard.key = event.key;
});
