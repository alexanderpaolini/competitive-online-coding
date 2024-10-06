// Example configuration file
module.exports = {
    // Add any configuration settings you need here
    websocketPort: process.env.WS_PORT || 8080,
    codeRunnerURL: 'http://localhost:8080/api/compile/json',
    baseURL: 'http://localhost:3001',
    serverBaseURL: 'http://localhost:3000',
    wsURL: 'ws://localhost:3000'
};
