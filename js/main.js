let gameState = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "]
];

const lines = [
    [[0,0], [0,1], [0,2]],
    [[1,0], [1,1], [1,2]],
    [[2,0], [2,1], [2,2]],
    [[0,0], [1,0], [2,0]],
    [[0,1], [1,1], [2,1]],
    [[0,2], [1,2], [2,2]],
    [[0,0], [1,1], [2,2]],
    [[0,2], [1,1], [2,0]]
]

let turn = "player";

const buttonRestart = document.querySelector(".btn-restart");

document.querySelectorAll(".cell").forEach(cell => cell.onclick = player);

function player() {
    if (turn !== "player") return;

    const row = this.dataset.row;
    const col = this.dataset.col;
    const val = gameState[row][col];

    if (val !== " ") {
        return;
    } else {
        gameState[row][col] = "X";
    }

    msg.innerText = "Ход противника";

    render();

    turn = "opponent";

    if (checkWinner()) return;
    
    setTimeout(opponent, 800);
}

function opponent() {
    let row, col, val;

    do {
        row = rnd();
        col = rnd();
        val = gameState[row][col];
    } while (val !== " ");

    const smartMove = find2of3("O") || find2of3("X");
    if (smartMove) {
        [row, col] = smartMove;
    }

    gameState[row][col] = "O";

    msg.innerText = "Ваш ход";

    render();
    if (checkWinner()) return;
    turn = "player";
}

function find2of3(sign) {
    const variants = [sign + sign + " ", sign + " " + sign, " " + sign + sign];

    const line = lines.find(line => variants.includes(
        line.map(([row, col]) => gameState[row][col]).reduce((a, b) => a + b, "")
    ));

    if (!line) {
        return false;
    }

    return line.find(([row, col]) => gameState[row][col] == " ");
}

function isFinished() {
    if (gameState.some(row => row.every(cell => cell == "X")) ||
        gameState.some((_, i) => gameState.every(row => row[i] == "X")) ||
        gameState.every((row, i) => row[i] == "X") ||
        gameState.every((row, i) => row[2 - i] == "X")) {
            return 'player';
    } else if (gameState.some(row => row.every(cell => cell == "O")) ||
               gameState.some((_, i) => gameState.every(row => row[i] == "O")) ||
               gameState.every((row, i) => row[i] == "O") ||
               gameState.every((row, i) => row[2 - i] == "O")) {
        return 'opponent';
    } else if (gameState.every(row => row.every(cell => cell !== " "))) {
        return 'draw';
    } else {
        return false;
    }
}

function checkWinner() {
    let finish = isFinished();
    if (finish == "player") {
        msg.innerText = 'Вы выиграли! Начните новую игру';
    } else if (finish == "opponent") {
        msg.innerText = 'Вы проиграли! Начните новую игру'
    } else if (finish == "draw") {
        msg.innerText = 'Ничья! Начните новую игру'
    } else {
        return false;
    }

    return true;
}

function rnd() {
    return Math.floor(Math.random()*3);
}

function render() {
    gameState.forEach((row, i) => row.forEach((cell, j) => {
        document.querySelector(`[data-row="${i}"][data-col="${j}"]`).firstChild.innerText = cell;
    }));
};

buttonRestart.onclick = function () {
    gameState = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "]
    ];

    msg.innerText = "";
    turn = "player";

    render();
}

buttonRestart.click();
render();