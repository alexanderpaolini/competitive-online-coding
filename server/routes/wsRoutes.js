const { handleCodeSubmission } = require('../controllers/codeController');
const gameController = require('../controllers/gameController');
const { getRandomProblem } = require('../services/problemService');
const Player = require('../structures/Player');

const setupWebSocket = (wss, problems) => {
    // dummy games. WIP
    gameController.createGame('1234')
    gameController.createGame('2345')

    wss.on('connection', (ws) => {
        const wsPlayer = new Player(ws)
        console.log('NEW CLIENT CONNECTED');

        ws.on('message', async (message) => {
            const { event, ...data } = JSON.parse(message);

            switch (event) {
                case 'CHAT': {
                    for (const p of wsPlayer.currentGame.players) {
                        p.sendChat(wsPlayer.identifier, data.message)
                    }
                    break;
                }
                case 'JOIN_LOBBY': {
                    const game = gameController.findGameByCode(data.lobby);

                    if (!game) {
                        wsPlayer.sendError("GAME NOT FOUND")
                        return;
                    } else if (game.status == "IN_PROGRESS") {
                        wsPlayer.sendError("GAME IN PROGRESS")
                        return;
                    }

                    console.log(wsPlayer.identifier, "JOINED", game.code);

                    game.addPlayer(wsPlayer)
                    wsPlayer.currentGame = game

                    for (const p of game.players) {
                        p.ws.send(JSON.stringify({
                            event: 'PLAYER_JOINED',
                            playerId: wsPlayer.identifier
                        }));
                    }

                    break;
                }
                case 'SEND_CODE': {
                    if (wsPlayer.currentGame?.status != "IN_PROGRESS") return

                    const problemJson = problems.find(x => x.identifier == data.problem);
                    await handleCodeSubmission(wsPlayer, data.code, data.language, problemJson);
                    break;
                }
                case 'PLAYER_STATUS_UPDATE': {
                    if (!wsPlayer.currentGame) return
                    const game = wsPlayer.currentGame

                    if (data.status == "READY") {
                        wsPlayer.status = "READY"

                        if (game.players.length >= 1 && game.players.every(x => x.status == "READY")) {
                            game.status = "IN_PROGRESS"

                            const problem = getRandomProblem(problems)
                            game.problem = problem.identifier

                            for (const p of game.players) {
                                p.ws.send(JSON.stringify({ event: 'GAME_STATUS_UPDATE', status: 'start', problem: problem }))
                            }
                        }
                    } else if (data.status == "NOT_READY") {
                        if (game.status == "OPEN") {
                            wsPlayer.status = "NOT_READY"
                        }
                    }
                    break;
                }
                default:
                    console.log('Unknown message type:', event);
            }
        });

        ws.on('close', () => {
            const game = wsPlayer.currentGame
            const playerIndex = game.players.indexOf(ws);
            game.players.splice(playerIndex, 1);
            console.log(`WebSocket removed from game with code ${game.code}`);
        });
    });
};

module.exports = { setupWebSocket };
