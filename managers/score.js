class Score {
    constructor() {
        this.startTime = Date.now()
        this.time = "00:00";
        this.timeInMs = 0;
    }

    getTime() {
        return this.time;
    }

    calculateTime() {
        let calcTime = Date.now() - this.startTime;
        let t = new Date(calcTime);
    
        let formatSeconds = t.getSeconds() < 10 ? `0${t.getSeconds()}` : t.getSeconds();
        let formatMinutes = t.getMinutes() < 10 ? `0${t.getMinutes()}` : t.getMinutes();
    
        this.time = `${formatMinutes}:${formatSeconds}`;
        this.calcTime = calcTime;
    }

    resetTime() {
        this.time = "00:00";
    }

    // TODO: call before game over
    saveTime() {
        localStorage.setItem('gnocchi_droppy_final_score_ms', this.timeInMs);
        localStorage.setItem('gnocchi_droppy_final_score', this.time);
    }
}


