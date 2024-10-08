class Game {
    /**
     * Game constructor
     * @param {String} code Unique game code to identify the game
     * @param {String} problem Problem description or object associated with the game
     */
    constructor(code, problem = '') {
        this.status = 'OPEN'; // Game status, starts as 'OPEN'
        this.code = code; // Unique game code
        this.players = []; // List of players (WebSocket objects)
        this.problem = problem; // Problem for the game, default is empty
        this.allowedPlayers = []; // List of player identifiers
    }

    /**
     * Add a player to the game
     * @param {WebSocket} player The player's WebSocket connection
     */
    addPlayer(player) {
        this.players.push(player);
        if (!this.allowedPlayers.includes(player.identifier))
            this.allowedPlayers.push(player.identifier)
    }

    /**
     * Start the game by setting the problem and updating status
     * @param {Object} problem The problem object for the game
     */
    startGame(problem) {
        this.problem = problem;
        this.status = 'IN_PROGRESS';
    }

    /**
     * End the game by updating the status
     */
    endGame() {
        this.problem = '';
        this.status = 'OPEN';
        this.players = [];
        this.allowedPlayers = [];
    }

    /**
     * Remove a player from the game
     * @param {WebSocket} player The player's WebSocket connection to remove
     */
    removePlayer(player) {
        this.players = this.players.filter(p => p !== player);
        if (this.players.length < 2 && this.status === 'IN_PROGRESS') {
            this.status = 'OPEN'; // Revert back to 'OPEN' if a player leaves during the game
        }
    }

    /**
     * Returns an exportable object. Just simple for API response
     * @returns doesn't matter
     */
    export() {
        return {
            status: this.status,
            code: this.code,
            players: this.players.map(x => x.identifier),
            problem: this.problem
        }
    }

    /**
     * Is a player allowed to join back
     * @param {Player} player The player
     * @returns true or false idk
     */
    isPlayerAllowed(player) {
        return this.allowedPlayers.includes(player.identifier)
    }
}

module.exports = Game;
