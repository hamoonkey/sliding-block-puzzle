import { Board } from "../src/Board.js";
import { UI } from "../src/UI.js";
import { expectEqual, expectNotEqual } from "./testUtils.js";

async function test() {
    const ui = new UI(document, "test");
    const userAction_setBoard = await ui.setBoard();
    
    const board = new Board(12, 8);
    board.setSequence_number();
    
    const userAction_playGame = await ui.playGame(board);
    console.log(userAction_playGame.moveTargetIndex);
    board.moveIfAnyPossible(userAction_playGame.moveTargetIndex);
    await ui.playGame(board)

}

test();