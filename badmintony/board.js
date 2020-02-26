function updateBoard() {
    for (val in game) {
        try {
            document.getElementById(val).innerHTML = game[val];
        } catch (e) {
            try {
                document.getElementById(val).value = game[val];
            } catch (e) {
                1;
            }
        }
    }
    for (var i of [1, 2]) {
        for (s of ["l", "r"]) {
            document.getElementById("t" + i + s + "serve").style.display = "none";
        }
    }

    document.getElementById(game.sp + "serve").style.display = "inline";


}

timeRunning = false;

function newGame(server) {
    // document.getElementById("gameStart").style.display = "none";
    game = { t2r: 'A', t2l: 'B', t2s: 0, t1s: 0, t1l: 'C', t1r: 'D', sp: (server === 'top' ? 't2r' : 't1r'), time: "0:00", startTime: new Date() }
    gameStates = [];
    timeRunning = true;
    startTime = new Date();
    updateBoard();
}

function addPoint(team) {
    gameStates.push(JSON.parse(JSON.stringify(game)));
    game["t" + team + "s"] += 1;
    let serverSide = game.sp[2];
    if (game.sp[1] == team) {
        game.sp = "t" + team + (serverSide === 'l' ? 'r' : 'l');
        let prevL = game["t" + team + "l"];
        let prevR = game["t" + team + "r"];
        game["t" + team + "l"] = prevR;
        game["t" + team + "r"] = prevL;
    }
    game.sp = "t" + team + (game["t" + team + "s"] % 2 == 0 ? 'r' : 'l');
    updateBoard();
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function updateTime() {
    if (timeRunning) {
        game.time = millisToMinutesAndSeconds(new Date() - game.startTime);
        updateBoard();
    }
}
// setInterval(function () { updateTime(); }, 100);

newGame('top');