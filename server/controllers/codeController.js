const config = require("../config/config");
const Player = require("../structures/Player");

const compileCode = async (code, language, testCases, memoryLimit = 500, timeLimit = 5) => {
    const url = config.codeRunnerURL;
    const payload = {
        sourcecode: code,
        language: language,
        testCases: testCases,
        memoryLimit: memoryLimit,
        timeLimit: timeLimit,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Error: ${await response.text()}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error compiling code:', error);
        throw error;
    }
};

/**
 * Handle code submission
 * @param {Player} player 
 * @param {*} code 
 * @param {*} language 
 * @param {*} problem 
 */
const handleCodeSubmission = async (player, code, language, problem) => {
    const testCases = problem.testCases;
    const memoryLimit = problem.memoryLimit || 500;
    const timeLimit = problem.timeLimit || 5;

    try {
        const result = await compileCode(code, language, testCases, memoryLimit, timeLimit);

        if (result.execution && result.execution.verdict === 'Accepted') {
            player.submissionResponse('pass')

            player.endGame('win')


            for (const p of player.currentGame.players) {
                if (p == player) continue

                p.endGame('lose')
            }

            player.currentGame.endGame()
        } else {
            player.submissionResponse('fail')
        }
    } catch (error) {
        console.log(error)
        player.submissionResponse('error')
    }
};

module.exports = {
    handleCodeSubmission,
};
