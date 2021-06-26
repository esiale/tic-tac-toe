const player = (name, mark, hisTurn) => {
    return {name, mark, hisTurn};
};

const gameBoard = (function() {

    let boardCurrent = [];
    boardCurrent = boardCurrent.fill(9);
    const boardGrids = document.querySelectorAll(".gameboard-container > div");

    for (let i = 0; i < boardCurrent.length; i++) {
        boardGrids[i].dataset.index = i;
    }

    document.querySelector(".gameboard-container").addEventListener("click", _makeChoice);

    const player1 = player("player1", "X", true);
    const player2 = player("player2", "O", false);

    function _checkPlayer() {
        if (player1.turn === true) {
            return player1;
        } else {
            return player2;
        }
    }

    function _makeChoice(e) {
        if (boardCurrent[e.target.dataset.index] !== "X" && boardCurrent[e.target.dataset.index] !== "O") {
            boardCurrent[e.target.dataset.index] = _checkPlayer().mark;
            e.target.textContent = _checkPlayer().mark;
            if (_checkPlayer() === player1) {
                player1.turn = false;
                player2.turn = true;
                gameController.checkWinning(boardCurrent, player1);
            } else {
                player1.turn = true;
                player2.turn = false;
                gameController.checkWinning(boardCurrent, player2);
            }
        }
    }

    return {
        boardCurrent: boardCurrent,
        boardGrids: boardGrids,
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
                    return true
                }
        } return false
    }

    return { 
        checkWinning: _checkWinning
    }
})();
