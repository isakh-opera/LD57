class SpeedControler {
    constructor() {
        this.startTime = 0;
        this.lastSpeedIncreaseTime = 0;
        this.currentRelativeSpeed = 0;

        this.speedIncreaseAmount = 1;
        this.speedIncreaseInterval = 5; // 5 second
    }
    
    getIncreaseAmount() {
        const currentTime = Date.now();
        console.log("checking speed increase", currentTime - this.lastSpeedIncreaseTime);
        if (currentTime - this.lastSpeedIncreaseTime > this.speedIncreaseInterval) {
            console.log("Speed increased");
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
