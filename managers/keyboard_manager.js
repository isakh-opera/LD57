function KeyboardManager() {
    this.keys = {};
    this.lastKeyTime = {}; // Last key press timestamp
    this.keyDelay = 90; // Key debounce delay (ms)

    this.isArrowDown = function() {
        const now = Date.now();
        // Check if within debounce period
        if (this.lastKeyTime['ArrowDown'] && now - this.lastKeyTime['ArrowDown'] < this.keyDelay) {
            return false;
        }
        
        if (this.keys['ArrowDown']) {
            this.lastKeyTime['ArrowDown'] = now;
            return true;
        }
        return false;
    }

    this.isArrowUp = function() {
        const now = Date.now();
        // Check if within debounce period
        if (this.lastKeyTime['ArrowUp'] && now - this.lastKeyTime['ArrowUp'] < this.keyDelay) {
            return false;
        }

        if (this.keys['ArrowUp']) {
            this.lastKeyTime['ArrowUp'] = now;
            return true;
        }
        return false;
    }
    this.isArrowLeftWithoutDebounce = function() {
        if (this.keys['ArrowLeft']) {
            return true;
        }
        return false;
    }

    this.isArrowRightWithoutDebounce = function() {
        if (this.keys['ArrowRight']) {
            return true;
        }
        return false;
    }
    
    this.onSpace = function(func) {
        document.addEventListener("keydown", (event) => {
            if (event.key === " " || event.code === "Space") {
                func();
            }
        });
    }
}

let keyboard = new KeyboardManager();

document.addEventListener("keyup", (event) => {
    keyboard.keys[event.key] = false;
});

document.addEventListener("keydown", (event) => {
    keyboard.keys[event.key] = true;
    keyboard.lastKeyTime[event.key] = Date.now();
});

function getKeyboard() {
    return keyboard;
}
