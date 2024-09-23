import { Game } from './objects/game';
import { AspectRatio } from './objects/canvas';

// TODO: consider creating and passing canvas HTMLElement from init
// startup function
const init = (
    aspectWidth: number,
    aspectHeight: number,
    height: number,
    cellRatio: number
) => {

    // get app div
    // if this fails, catastrophe ensues

    const app = document.getElementById("app");
    if (app === null) {
        throw new TypeError("Could not find HTML app element.");
    }
    app instanceof HTMLElement;

    try {
        let game = new Game(
            app,
            new AspectRatio(aspectWidth, aspectHeight),
            height,
            cellRatio
        );
        
        game.draw(0, 0);
    } catch(error) {
        let message;
        if (error instanceof Error) {
            message = error.message;
        } else {
            message = String(error)
        }
        app.innerText = `Error caught: ${error}`;
    }
}

init(3, 2, 480, 10);