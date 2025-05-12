import { Board } from "../src/Board.js";
import { expectEqual, expectNotEqual, expectEqualArray } from "./testUtils.js";

function test3x3() {
    const board = new Board(3, 3);
    
    // number
    board.setSequence_number();
    expectSequence(['1', '2', '3', '4', '5', '6', '7', '8', null], board.sequence);
    
    // alphabet
    board.setSequence_alphabet();
    expectSequence(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', null], board.sequence);
    
    // hiragana
    board.setSequence_hiragana();
    expectSequence(['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', null], board.sequence);
    
    // scramble
    board.setSequence(['1', '2', '3', '4', null, '6', '7', '8', '5']);
    expectEqualArray([1, 7, 3, 5], board.listMovableIndex());
    
    // move
    board.setSequence_hiragana();
    board.moveDown(5);
    expectSequence(['あ', 'い', 'う', 'え', 'お', null, 'き', 'く', 'か'], board.sequence);
    board.moveUp(8);
    expectSequence(['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', null], board.sequence);
    board.moveRight(7);
    expectSequence(['あ', 'い', 'う', 'え', 'お', 'か', 'き', null, 'く'], board.sequence);
    board.moveLeft(8);
    expectSequence(['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', null], board.sequence);
    
    // isFinish
    board.setSequence_alphabet();
    expectEqual(true, board.isFinish());
    board.scramble();
    expectEqual(false, board.isFinish());
    
    // -- utils --
    function expectSequence(expectDisplays, actualSequence) {
        expectEqual(expectDisplays.length, actualSequence.length);
    
        for (let i = 0; i < expectDisplays.length; i++) {
            if (expectDisplays[i] === null) {
                expectEqual(expectDisplays[i], null);
            } else {
                expectEqual(expectDisplays[i], actualSequence[i].display);
            }
        }
    }
}

function testLarge() {
    const board = new Board(12, 8);
    board.setSequence_number();
    expectEqual('95', board.sequence.at(-2).display);
}

test3x3();
testLarge();