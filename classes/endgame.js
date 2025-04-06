
class Endgame {
    constructor() {
        this.scoreName = document.getElementById('score_name');
        this.scoreButton = document.getElementById('score_button');
        this.finalScore = 0; //timestamp

        this.scoreButton.onclick = () => {
            const username = this.scoreName.value;
            //localStorage.setItem(`ld57_${username}`, this.finalScore);
            this.saveFinalScore(username, this.finalScore);
        };
    }

    saveFinalScore(username, score) {
        fetch('http://localhost:3000/api/highscores', {
            method: 'POST',
            body: JSON.stringify({
                username,
                score,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((response) => {
            console.log(response.json());
        });
    }

    setFinalScore(score) {
        this.finalScore = score;
    }
}