import { Board } from "./Board.js";
import { UI } from "./UI.js";

export class Game {
    constructor() {
        this.state = null;
        this.board = null;
        this.ui = null;
        this.count = null;
    }

    setUI(document, elementId) {
        this.ui = new UI(document, elementId);
    }

    start() {
        this.state = "setBoard";
        this.loop();
    }

    async loop() {
        while(true) {
            switch (this.state) {
                case "setBoard":
                    const userAction_setBoard = await this.ui.setBoard();
                    this.board = new Board(userAction_setBoard.RowN, userAction_setBoard.ColN);
                    this.board.setSequence_number();
                    this.count = 0;
                    
                    this.state = "scrambleBoard";
                    break;
                case "scrambleBoard":
                    await this.ui.scrambleBoard(this.board);
                    this.state = "playGame";
                    break;
                case "playGame":
                    const userAction_playGame = await this.ui.playGame(this.board, this.count);
                    switch (userAction_playGame.type) {
                        case "restartGame":
                            this.state = "setBoard";
                            break;
                        case "moveBlock":
                            this.board.moveIfAnyPossible(userAction_playGame.moveTargetIndex);
                            this.count++;
                            break;
                        default:
                            throw new Error("not reach");
                    }
                    if (this.board.isFinish()) {
                        this.state = "resultGame";
                    }
                    break;
                case "resultGame":
                    await this.ui.resultGame(this.board, this.count);
                    this.state = "setBoard";
                    break;
                default:
                    throw new Error("not reach");
            }
        }
    }
}