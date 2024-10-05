const Game = require('./Game');

class Player {
    /**
     * @typedef import('ws').WebSocket The websocket
     */
    ws;

    /**
     * @typedef {String} The status of the player
     */
    status = "NOT_READY";

    /**
     * @typedef {Game|undefined} The current game (if defined)
     */
    currentGame;

    /**
     * Player constructor
     * @param {import('ws').WebSocket} ws The websocket connection for this player
     */
    constructor(ws) {
        this.ws = ws;
    }

    /**
     * Send an error message to the player's websocket
     * @param {String} message The error message to send
     */
    sendError(message) {
        this.ws.send(JSON.stringify({
            event: 'ERROR',
            message: message
        }));
    }

    /**
     * Send a chat message, including sender and message
     * @param {String} from The sender's name or identifier
     * @param {String} message The message content
     */
    sendChatMessage(from, message) {
        this.ws.send(JSON.stringify({
            event: 'CHAT',
            from: from,
            message: message
        }));
    }

    /**
     * Start a game for this player
     * @param {Object} problem The problem object containing title, description, etc.
     */
    startGame(problem) {
        this.ws.send(JSON.stringify({
            event: 'GAME_STATUS_UPDATE',
            status: 'start',
            problem: problem
        }));
    }

    /**
     * End the game for this player
     * @param {String} result The result of the game (e.g., 'win', 'lose', 'draw')
     */
    endGame(result) {
        this.ws.send(JSON.stringify({
            event: 'GAME_STATUS_UPDATE',
            status: 'end',
            result: result
        }));
    }

    /**
     * A response to the submission
     * @param {String} result The result of the status
     */
    submissionResponse(result) {
        this.ws.send(JSON.stringify({
            event: 'SUBMISSION_RESPONSE',
            result: result
        }))
    }
}

module.exports = Player;
