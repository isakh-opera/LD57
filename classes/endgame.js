
class Endgame {
    constructor() {
        this.endInput = document.getElementsByClassName('endgame-input')[0];
        this.scoreName = document.getElementById('score_name');
        this.scoreButton = document.getElementById('score_button');
        this.finalScore = 0; //timestamp
        this.ranking = [];

        this.scoreButton.onclick = async () => {
            const username = this.scoreName.value;
            const success = await this.saveFinalScore(username, this.finalScore);
            this.endInput.style.visibility = 'hidden';

            // show success message

            this.ranking = await this.listTop5Ranking();
        };
    }

    async saveFinalScore(username, score) {
        try {
            await fetch('http://localhost:3000/api/highscores', {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    score,
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            return true;
        } catch (e) {
            return false;
        }
    }

    async listTop5Ranking() {
        try {
            const response = await fetch('http://localhost:3000/api/highscores', {
                method: 'GET',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })

            if (!response.ok) {
                return [];
            }

            const data = await response.json();
            return data;
        } catch (e) {
            return [];
        }
    }

    getTop5Ranking() {
        return this.ranking;
    }

    setFinalScore(score) {
        this.finalScore = score;
    }
}