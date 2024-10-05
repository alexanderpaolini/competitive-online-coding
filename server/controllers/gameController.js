const Game = require("../structures/Game");

class GameController {
    constructor() {
        this.currentGames = []; // Array to store the list of games
    }

    /**
     * Create a new game
     * @param {String} code Unique game code
     * @param {String} [problem] Optional problem associated with the game
     * @returns {Game} The created game
     */
    createGame(code, problem = '') {
        const newGame = new Game(code, problem);
        this.currentGames.push(newGame);
        return newGame;
    }

    /**
     * Find a game by its code
     * @param {String} code The unique code for the game
     * @returns {Game|null} The found game or null if not found
     */
    findGameByCode(code) {
        return this.currentGames.find(game => game.code === code) || null;
    }

    /**
     * Remove a game from the list of current games
     * @param {String} code The unique code for the game
     */
    removeGame(code) {
        this.currentGames = this.currentGames.filter(game => game.code !== code);
    }

    export() {
        return this.currentGames.map(x => x.export())
    }
}

module.exports = new GameController();
