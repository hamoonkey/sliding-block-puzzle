
export class UserAction_setBoard {
    constructor() {
        this.RowN = null;
        this.ColN = null;
    }
}
export class UserAction_playGame {
    constructor() {
        this.type = null;
        this.moveTargetIndex = null;
    }
}

export class UI {
    constructor(document, elementId) {
        this.document = document
        this.appRoot = this.getElement(elementId);
    }

    async setBoard() {
        // show
        const id_RowN = "js-RowN";
        const id_ColN = "js-ColN";
        const id_ok = "js-ok";

        this.appRoot.innerHTML = `<div><label>RowN : <input id="${id_RowN}" type="number" min="1" step="1" value="3"></label></div>
<div><label>ColN : <input id="${id_ColN}" type="number" min="1" step="1" value="3"></label></div>
<button id="${id_ok}" type="button">ok</button>`;

        // input
        function waitForClick(button) {
            return new Promise((resolve) => {
                const handler = () => {
                    button.removeEventListener("click", handler);
                    resolve();
                };
                button.addEventListener("click", handler);
            });
        }
        await waitForClick(this.getElement(id_ok))

        // return
        const ret = new UserAction_setBoard();
        ret.RowN = parseInt(this.getElement(id_RowN).value);
        ret.ColN = parseInt(this.getElement(id_ColN).value);
        return ret;
    }

    async scrambleBoard(board) {
        this.appRoot.innerHTML = this.convertToHTML(board, 0);
        function waitForTime(msec) {
            return new Promise((resolve) => {
                setTimeout(()=>{
                    resolve();
                }, msec);
            });
        }
        for (let i = 0; i < board.RowN*board.ColN*2; i++) {
            board.scrambleOnce();
            this.appRoot.innerHTML = this.convertToHTML(board, i+1);
            await waitForTime(100);
        }
    }

    convertToHTML(board, count) {
        let innerHTML = `<div>count : ${count}</div>`
        innerHTML += '<table border="1" style="width: 30vh; height: 30vh; text-align: center; cursor: pointer">';
        for (let r = 0; r < board.RowN; r++) {
            innerHTML += "<tr>";
            for (let c = 0; c < board.ColN; c++) {
                innerHTML += `<td id="js-${r}_${c}" data-row="${r}" data-col="${c}">${board.sequence[r*board.ColN + c] ? board.sequence[r*board.ColN + c].display : ""}</td>`
            }
            innerHTML += "</tr>";
        }
        innerHTML += "</table>";
        return innerHTML;
    }

    async playGame(board, count) {
        // show
        let innerHTML = this.convertToHTML(board, count);
        const id_restart = "js-restart";
        innerHTML += `<button id="${id_restart}" type="button">restart game</button>`
        this.appRoot.innerHTML = innerHTML;

        // input
        function waitForClick(button) {
            return new Promise((resolve) => {
                const handler = (event) => {
                    button.removeEventListener("click", handler);
                    resolve({
                        id: event.target.id,
                        row: parseInt(event.target.dataset.row),
                        col: parseInt(event.target.dataset.col)
                    });
                };
                button.addEventListener("click", handler);
            });
        }
        
        const waitForClicks = [];
        for (let r = 0; r < board.RowN; r++) {
            for (let c = 0; c < board.ColN; c++) {
                waitForClicks.push(waitForClick(this.getElement(`js-${r}_${c}`)));
            }
        }
        waitForClicks.push(waitForClick(this.getElement(id_restart)));
        const {id, row, col} = await Promise.any(waitForClicks);

        // return 
        const ret = new UserAction_playGame();
        if (id === id_restart) {
            ret.type = "restartGame";
        } else {
            ret.type = "moveBlock";
            ret.moveTargetIndex = row*board.RowN+col;
        }
        return ret;
    }

    async resultGame(board, count) {
        // show
        const id_ok = "js-ok";
        let innerHTML = this.convertToHTML(board, count);
        innerHTML += `<button id="${id_ok}" type="button">ok</button>`;
        this.appRoot.innerHTML = innerHTML;


        // input
        function waitForClick(button) {
            return new Promise((resolve) => {
                const handler = (event) => {
                    button.removeEventListener("click", handler);
                    resolve();
                };
                button.addEventListener("click", handler);
            });
        }
        await waitForClick(this.getElement(id_ok));
    }

    getElement(id) {
        return this.document.getElementById(id);
    }
}