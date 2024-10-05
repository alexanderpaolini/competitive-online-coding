const logger = (message) => {
    const timeStamp = new Date().toISOString();
    console.log(`[${timeStamp}] ${message}`);
};

module.exports = logger;
