const player = (name, mark, hisTurn) => {
    return {name, mark, hisTurn};
};

const gameBoard = (function() {

    let boardCurrent = [];
    
    const boardGrids = document.querySelectorAll(".gameboard-container > div");
    const messagePanel = document.querySelector(".panel-message-mid");
    const nameChange = document.querySelectorAll(".name-change");
    
    document.querySelector(".panel-mid").addEventListener("click", _reset);

    document.getElementById("start").addEventListener("click", _activateGame);

    const player1 = player("Player 1", "X", true);
    const player2 = player("Player 2", "O", false);

    function _checkPlayer() {
        if (player1.hisTurn === true) {
            return player1;
        } else {
            return player2;
        }
    }

    function _makeChoice(e) {
        if (boardCurrent[e.target.dataset.index] !== "X" && boardCurrent[e.target.dataset.index] !== "O") {
            boardCurrent[e.target.dataset.index] = _checkPlayer().mark;
            e.target.textContent = _checkPlayer().mark;
            messagePanel.textContent = "";
            if (_checkPlayer() === player1) {
                player1.hisTurn = false;
                player2.hisTurn = true;
                gameController.checkWinning(boardCurrent, player1);
            } else {
                player1.hisTurn = true;
                player2.hisTurn = false;
                gameController.checkWinning(boardCurrent, player2);
            }
        } 
    }

    function _activateGame() {
        const overlay = document.querySelector(".overlay");
        document.querySelector(".panel").removeChild(overlay);
        _startGame();
    }

    function _startGame() {
        messagePanel.removeEventListener("click", _startGame);
        document.querySelector(".gameboard-container").addEventListener("click", _makeChoice);
        nameChange.forEach(element => element.addEventListener("click", _changeName)); 
        messagePanel.textContent = `${_checkPlayer().name} goes first!`;
        boardCurrent = [];
        
        boardGrids.forEach(element => {
            element.textContent = "";
            element.removeAttribute('style');
            boardCurrent.push(element.dataset.index);
        });
    }

    function _concludeGame(player) {
        document.querySelector(".gameboard-container").removeEventListener("click", _makeChoice);
        nameChange.forEach(element => element.removeEventListener("click", _changeName));

        if (player === "draw") {
            messagePanel.textContent = `It's a draw! Click here to start next round.`
        } else {
        messagePanel.textContent = `${player.name} has won the game! Click here to start next round.`;
        }
        messagePanel.addEventListener("click", _startGame);
        player.hisTurn = false;
    }

    function _changeName(e) {
        if (e.target.parentNode.className == "panel-left") {
            let newName = prompt("Input new name:", "Player 1");
            if (newName.length > 30) {
                alert("Max number of characters is 30.");
                return
            }
            player1.name = newName;
            document.querySelector(".panel-left > p").textContent = player1.name;
        } else {
            let newName = prompt("Input new name:", "Player 2");
            if (newName.length > 30) {
                alert("Max number of characters is 30.");
                return
            }
            player2.name = newName;
            document.querySelector(".panel-right > p").textContent = player2.name;
        }
    }

    function _reset() {
        player1.hisTurn = true;
        player2.hisTurn = false;
        player1.name = "Player 1";
        player2.name = "Player 2";
        document.querySelector(".panel-left > p").textContent = player1.name;
        document.querySelector(".panel-right > p").textContent = player2.name;
        _startGame();
    }

    return {
        boardCurrent: boardCurrent,
        boardGrids: boardGrids,
        concludeGame: _concludeGame
    }
})();

const gameController = (function() {

    gameBoard.boardGrids.forEach(function (grid, i) {
        grid.dataset.index = i;
    });

    function _checkWinning(board, player) {
        const winningTriads = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let i = 0; i < winningTriads.length; i++) {
            let check1 = winningTriads[i][0]
            let check2 = winningTriads[i][1]
            let check3 = winningTriads[i][2]
            if (board[check1] === player.mark
                && board[check2] === player.mark
                && board[check3] === player.mark) {
                    let winningGrids = document.querySelectorAll(`div[data-index="${check1}"], div[data-index="${check2}"], div[data-index="${check3}"]`)
                    winningGrids.forEach(element => element.style.color="rgb(153, 0, 0, 0.8)");
                    return gameBoard.concludeGame(player);
            }
        }
        if (board.every(element => element === "X" || element === "O")) {
            return gameBoard.concludeGame("draw");
        } else {
            return false
        }
    }

    return { 
        checkWinning: _checkWinning
    }
})();
