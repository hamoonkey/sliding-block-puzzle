import { Block } from "./Block.js";

export class Board {
    constructor (RowN, ColN) {
        this.RowN = RowN;
        this.ColN = ColN;
        this.sequence = []; // Array<Block>
    }

    // -- setSequence --
    /**
     * @param {string} displays 
     */
    setSequence(displays) {
        if (displays.length !== this.RowN*this.ColN) {
            throw new Error("invalid");
        }
        this.sequence = [];
        for (let i = 0; i < displays.length; i++) {
            this.sequence.push(displays[i] === null ? null : new Block(i, displays[i]));
        }
    }

    setSequence_number() {
        const seq = [];
        for (let i = 0; i < this.RowN*this.ColN -1; i++) {
            seq.push((i+1).toString());
        }
        seq.push(null);
        this.setSequence(seq);
    }
    setSequence_alphabet() {
        const seq = [];
        for (let i = 0; i < this.RowN*this.ColN -1; i++) {
            seq.push(String.fromCharCode(65 + i));
        }
        seq.push(null);
        this.setSequence(seq);
    }
    setSequence_hiragana() {
        const hiragana = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
        const seq = [];
        for (let i = 0; i < this.RowN*this.ColN -1; i++) {
            seq.push(hiragana[i]);
        }
        seq.push(null);
        this.setSequence(seq);
    }

    scrambleOnce() {
        const movableIndexes = this.listMovableIndex();
        this.moveIfAnyPossible(movableIndexes[Math.floor(Math.random() * movableIndexes.length)]);
    }
    scramble() {
        for (let i = 0; i < this.RowN*this.ColN; i++) {
            this.scrambleOnce();
        }
    }
    listMovableIndex() {
        const blankIndex = this.sequence.findIndex((b) => b === null);
        
        const ret = [];
        if (!this.atUpperEdge(blankIndex)) ret.push(blankIndex-this.ColN);
        if (!this.atBottomEdge(blankIndex)) ret.push(blankIndex+this.ColN);
        if (!this.atLeftEdge(blankIndex)) ret.push(blankIndex-1);
        if (!this.atRightEdge(blankIndex)) ret.push(blankIndex+1);

        return ret;
    }

    atUpperEdge(index) {
        return index >= 0 && index < this.ColN;
    }
    atBottomEdge(index) {
        return index >= this.ColN*(this.RowN-1) && index < this.ColN*this.RowN;
    }
    atLeftEdge(index) {
        return index % this.ColN === 0;
    }
    atRightEdge(index) {
        return index % this.ColN === this.ColN - 1;
    }

    // -- move --
    moveUp(index) {
        if (this.atUpperEdge(index)) return false;
        if(this.sequence[index - this.ColN] === null) {
            this.swap(index, index - this.ColN);
            return true;
        }
        return false;
    }
    moveDown(index) {
        if (this.atBottomEdge(index)) return false;
        if(this.sequence[index + this.ColN] === null) {
            this.swap(index, index + this.ColN);
            return true;
        }
        return false;
    }
    moveLeft(index) {
        if (this.atLeftEdge(index)) return false;
        if(this.sequence[index - 1] == null) {
            this.swap(index, index - 1);
            return true;
        }
        return false;
    }
    moveRight(index) {
        if (this.atRightEdge(index)) return false;
        if(this.sequence[index + 1] == null) {
            this.swap(index, index + 1);
            return true;
        }
        return false;
    }
    swap(index1, index2) {
        const tmp = this.sequence[index2];
        this.sequence[index2] = this.sequence[index1];
        this.sequence[index1] = tmp;
    }
    moveIfAnyPossible(index) {
        if (this.moveUp(index)) return;
        if (this.moveDown(index)) return;
        if (this.moveLeft(index)) return;
        if (this.moveRight(index)) return;
    }

    // -- isFinish --
    isFinish() {
        for (let i = 0; i < this.RowN*this.ColN - 1; i++) {
            if (this.sequence[i]?.order !== i) {
                return false;
            }
        }
        if (this.sequence[-1] === null) {
            return false;
        }
        return true;
    }
}