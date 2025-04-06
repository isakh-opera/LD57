var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function update() {
    drawEndgame();
    requestAnimationFrame(update);
}

const endgame = new Endgame();

function drawEndgame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const grad = ctx.createLinearGradient(0, 0, 0, window.innerHeight/2);
    grad.addColorStop(0, "lightblue");
    grad.addColorStop(1, "darkblue"); 

    ctx.fillStyle = grad;
    ctx.fillRect(window.innerWidth/2-640/2, 0, 640, window.innerHeight/2);

    const grad2 = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
    grad2.addColorStop(0, "gray");
    grad2.addColorStop(1, "black");

    ctx.fillStyle = grad2;
    ctx.fillRect(window.innerWidth/2-640/2, window.innerHeight/2, 640, window.innerHeight);

    ctx.fillStyle = "gray";
    ctx.moveTo(window.innerWidth/2-640/2, window.innerHeight/2);
    ctx.lineTo(window.innerWidth/2-640/2+172, window.innerHeight/2);
    ctx.lineTo(window.innerWidth/2-640/2, window.innerHeight);
    ctx.fill();

    ctx.fillStyle = "gray";
    ctx.moveTo(window.innerWidth/2+640/2, window.innerHeight/2);
    ctx.lineTo(window.innerWidth/2+640/2-172, window.innerHeight/2);
    ctx.lineTo(window.innerWidth/2-640/2, window.innerHeight);
    ctx.fill();

    ctx.fillRect(window.innerWidth/2+640/2-172, window.innerHeight/2, 172, window.innerHeight);

    ctx.fillStyle = "#000000";
    ctx.font = "48px serif";

    const title = "Game Over";
    ctx.fillText(title, window.innerWidth/2 - ctx.measureText(title).width/2, 64);

    // TODO: use actual score here
    const score = `Your Score: 00:00`;
    ctx.font = "36px serif";
    ctx.fillText(score, window.innerWidth/2 - ctx.measureText(score).width/2, 150)

    endgame.showEndgameInput(window.innerWidth, window.innerHeight, ctx);

    const inputText = 'Ranking';
    ctx.font = "32px serif";
    ctx.fillText(inputText, window.innerWidth/2 - ctx.measureText(inputText).width/2, 220);

    // print ranking
    ctx.font = "24px serif";

    // TODO: get data from postgres
    ctx.fillText("User 1", window.innerWidth/2 - 200, 300);
    ctx.fillText("00:00", window.innerWidth/2+100, 300);
    

    ctx.fillText("User 2", window.innerWidth/2 - 200, 340);
    ctx.fillText("00:00", window.innerWidth/2+100, 340);

    ctx.fillText("User 3", window.innerWidth/2 - 200, 380);
    ctx.fillText("00:00", window.innerWidth/2+100, 380);

    ctx.fillText("User 4", window.innerWidth/2 - 200, 420);
    ctx.fillText("00:00", window.innerWidth/2+100, 420);

    ctx.fillText("User 5", window.innerWidth/2 - 200, 460);
    ctx.fillText("00:00", window.innerWidth/2+100, 460);

    // input
    ctx.fillText(this.playerName || "Enter your name...", window.innerWidth/2 - 100, 500);
}

requestAnimationFrame(update);