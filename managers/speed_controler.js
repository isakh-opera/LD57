class SpeedControler {
    constructor() {
        this.startTime = 0;
        this.lastSpeedIncreaseTime = 0;
        this.currentRelativeSpeed = 0;

        this.speedIncreaseAmount = 1;
        this.speedIncreaseInterval = 10 * 1000; // 10 seconds
    }
    
    getIncreaseAmount() {
        const currentTime = Date.now();
        if (currentTime - this.lastSpeedIncreaseTime > this.speedIncreaseInterval) {
            this.currentRelativeSpeed += this.speedIncreaseAmount;
            this.lastSpeedIncreaseTime = currentTime;
            return this.speedIncreaseAmount;
        }
        return 0;
    }
    reset() {
        this.startTime = Date.now();
        this.lastSpeedIncreaseTime = this.startTime;
        this.currentRelativeSpeed = 0;
    }
}
