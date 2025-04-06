class Score {
    constructor() {
        this.startTime = Date.now()
        this.time = "00:00";
        this.timeInMs = 0;
        this.finalScore = 0;
        this.gameAlreadySaved = false;
    }

    getTime() {
        return this.time;
    }

    formatTime(t) {
        const time = new Date(t);
        const formatSeconds = time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds();
        const formatMinutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
        return `${formatMinutes}:${formatSeconds}`;
    }

    calculateTime() {
        let calcTime = Date.now() - this.startTime;
        this.time = this.formatTime(calcTime);
        this.calcTime = calcTime;
    }

    resetTime() {
        this.time = "00:00";
        this.startTime = Date.now();
        this.gameAlreadySaved = false;
    }

    saveTime() {
        if (!this.gameAlreadySaved){
            this.finalScore = this.calcTime;
            this.gameAlreadySaved = true;
        }
    }

    getFinalScore() {
        return this.finalScore;
    }
}


