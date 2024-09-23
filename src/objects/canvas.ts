import { Color } from './color';

export class AspectRatio {
    public width: number;
    public height: number;

    // width and height must be integers
    constructor(w: number, h: number) {
        if(!Number.isInteger(w)) {
            throw new RangeError(`Width ${w} must be an integer.`);
        } else if (!Number.isInteger(h)) {
            throw new RangeError(`Height ${h} must be an integer.`);
        }

        this.width = w;
        this.height = h;
    }

    public calculateWidth = (h: number): number => {
        return h * this.width / this.height;
    }
}

export class Canvas {
    public aspectRatio: AspectRatio; // ratio of width/height
    public width: number; // canvas width in px
    public height: number; // canvas height in px
    public cellRatio: number; // number of pixels per cell (valid cell ratios included in validCellRatios)
    public validCellRatios: number[];

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    // height (h) is used to calculate width in conjunction with ratio
    constructor(ratio: AspectRatio, h: number, cRatio: number, app: HTMLElement) {
        // setting aspect ratio
        this.aspectRatio = ratio;

        // setting pixel width and height, throws RangeError if height is not an integer
        if (Number.isInteger(h)) {
            this.width = ratio.calculateWidth(h);
            this.height = h;
        } else {
            throw new RangeError(`Height ${h} must be an integer.`)
        }
        
        // calculating valid cell ratios
        this.validCellRatios = this.calcValidCellRatios();

        // setting cell ratio, throws RangeError if invalid
        if (Number.isInteger(cRatio)) {
            if (this.isValidCellRatio(cRatio)) {
                this.cellRatio = cRatio;
            } else {
                throw new RangeError(`Cell Ratio ${cRatio} is outside validCellRatios.`);
            }
        } else {
            throw new RangeError(`Cell Ratio ${cRatio} must be an integer.`)
        }

        // creates canvas and sets width and height
        const c = document.createElement("canvas");
        c.width = this.width;
        c.height = this.height;

        // sets canvas as child of app div and saves it to canvas object
        app?.appendChild(c);
        this.canvas = c;
        
        const context = c.getContext("2d");
        if (context === null) {
            throw new TypeError("Get context failed. This should not happen.");
        }
        context instanceof CanvasRenderingContext2D;
        this.ctx = context;
    }

    private calcValidCellRatios = (): number[] => {
        let cellRatios = [];
        
        for (let i = 0; i < this.width; i++) {
            if (Number.isInteger(this.width / i)) {
                cellRatios.push(i);
                if (this.width / i === this.aspectRatio.width) break;
            }
        }

        return cellRatios;
    }

    public isValidCellRatio = (cRatio: number): boolean => {
        return (this.validCellRatios.includes(cRatio));
    }

    public updateCanvasSize(ratio: AspectRatio, h: number, cRatio?: number) {
        if (!Number.isInteger(h)) throw new RangeError(`Height ${h} must be an integer.`);

        this.aspectRatio = ratio;
        this.width = ratio.calculateWidth(h);

        this.validCellRatios = this.calcValidCellRatios();

        // TODO: this if statement creates a gross number of brackets at the end, probably needs refactoring        
        if(cRatio !== null) {
            // if cRatio isn't undefined, it must be a number. Flagging as number
            cRatio = Number(cRatio);
            if (Number.isInteger(cRatio)) {
                if (this.validCellRatios.includes(cRatio)) {
                    this.cellRatio = cRatio;
                } else {
                    throw new RangeError(`Cell Ratio ${cRatio} is not a valid cell ratio`);
                }
            } else {
                throw new RangeError(`Cell Ratio ${cRatio} must be an integer.`)
            }
        } else {
            // if cellRatio is in valid cell ratios, leave it
            if (!this.validCellRatios.includes(this.cellRatio)) {
                // set cell ratio to nearest value
                for (let i = 0; i < this.validCellRatios.length; i++) {
                    // if last value is reached, set cellRatio to last value
                    if (i === this.validCellRatios.length - 1) {
                        this.cellRatio = this.validCellRatios[i];
    
                    // find point where validCellRatios[i] is less than cellRatio
                    // closest value is whatever has lower absolute dist
                    } else if (this.validCellRatios[i] > this.cellRatio) {
                        if (i === 0) {
                            return this.validCellRatios[i];
                        } else {
                            if (this.validCellRatios[i] - this.cellRatio < Math.abs(this.validCellRatios[i - 1] - this.cellRatio)) {
                                this.cellRatio = this.validCellRatios[i];
                            } else this.cellRatio = this.validCellRatios[i];
                        }
                    }
                }
            }  
        }
    }

    // updates canvas
    public draw = (screen: Color[][]) => {
        if (screen.length != this.width) {
            throw new RangeError (`Screen width (${screen.length}) does not match canvas width (${this.width})`);
        }
        
        if (screen[0].length != this.height) {
            throw new RangeError (`Screen height (${screen[0].length}) does not match canvas width (${this.height})`);
        }

        for (let i = 0; i < screen.length; i++) {
            for (let j = 0; j < screen[0].length; j++) {
                this.ctx.fillStyle = screen[i][j].printFullColor();
                this.ctx.fillRect(i, j, this.cellRatio, this.cellRatio);
            }
        }
    }
}