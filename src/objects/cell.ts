import { Color } from './color';

export class Cell {
    // TODO: this is probably temporary, color should be a calculation based on multiple factors
    public color: Color;

    constructor(c: Color) {
        this.color = c;
    }
}