class Logger {
    constructor () {}

    log (...message) {
        const timeStamp = new Date().toLocaleString();
        console.log(`[${timeStamp}]`, ...message);
    }
}

module.exports = new Logger();
