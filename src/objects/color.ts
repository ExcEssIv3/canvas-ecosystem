export enum ColorWay {
    Red,
    Green,
    Blue
}

export class Color {
    private r: number;
    private g: number;
    private b: number;

    constructor(red: number, green: number, blue: number) {
        this.r = this.colorValidation(red, ColorWay.Red);
        this.g = this.colorValidation(green, ColorWay.Green);
        this.b = this.colorValidation(blue, ColorWay.Blue);
    }

    public updateColor(color: number, colorName: ColorWay) {
        switch (colorName) {
            case ColorWay.Red: {
                this.r = this.colorValidation(color, colorName);
                break;
            }
            case ColorWay.Green: {
                this.g = this.colorValidation(color, colorName);
                break;
            }
            case ColorWay.Blue: {
                this.b = this.colorValidation(color, colorName);
                break;
            }
            default: {
                throw new RangeError("Default switch case reached. colorName valid was unexpected (this shouldn't happen).");
            }
        }
    }

    public getRed = (): number => {
        return this.r;
    }

    public getGreen = (): number => {
        return this.g;
    }

    public getBlue = (): number => {
        return this.b;
    }

    public printFullColor = (): string => {
        return `rgb(${this.r} ${this.g} ${this.b})`;
    }

    // function to validate the color is appropriate
    private colorValidation = (color: number, colorName: ColorWay): number => {
        if (!Number.isInteger(color)) {
            throw new RangeError(`Color ${colorName} needs to be between 0 and 255 (inclusive). Value: ${color}.`);
        } else if (color < 0 || color > 255){
            throw new RangeError(`Color ${colorName} needs to be an integer. Value: ${color}`);
        }

        return color;
    }
}