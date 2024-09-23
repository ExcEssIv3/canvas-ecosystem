import { Canvas, AspectRatio } from './canvas';
import { Cell } from './cell';
import { Color } from './color'; 

export class Game {
    canvas: Canvas;
    cells: Cell[][]; // game board

    constructor(
        app: HTMLElement, // div to draw canvas in
        ratio: AspectRatio, // aspect ratio
        h: number, // height
        cellRatio: number, // ratio of cells to pixels
        cellWidth?: number, // width of game board
        cellHeight?: number // height of game board
    ) {
        this.canvas = new Canvas(ratio, h, cellRatio, app);
        
        // creates cells (if cell width and height not defined, sets to size of canvas)
        this.cells = this.constructGameBoard(cellWidth ?? ratio.calculateWidth(h), cellHeight ?? h);
    }

    // generates color array to be passed to canvas object and drawn to screen. if location is ever out of bounds of cells, will draw grey
    public draw = (horizontalIndex: number, verticalIndex: number) => {
        const screen: Color[][] = [[], []];
        // create screen
        for (let i = horizontalIndex; i < horizontalIndex + this.cells.length; i++) {
            for (let j = verticalIndex; j < verticalIndex + this.cells[0].length; j++) {
                if (i < 0 || i >= this.cells.length || j < 0 || j >= this.cells[0].length) {
                    screen[i][j] = new Color(100, 100, 100);
                } else {
                    screen[i][j] = this.cells[i][j].color;
                }
            }
        }

        this.canvas.draw(screen);
    }

    // constructs game board
    // TODO: update game board creation to not be black and white noise
    private constructGameBoard = (cellWidth: number, cellHeight: number): Cell[][] => {
        let board: Cell[][] = [[], []];
        
        // creates game board of alternating black and white colors (yucky)
        let black = false;
        for (let i = 0; i < cellWidth; i++) {
            for (let j = 0; j < cellHeight; j++) {
                board[i][j] = (black) ? new Cell(new Color(0, 0, 0)) : new Cell(new Color(255, 255, 255));
            }
        }
        return board;
    }
}