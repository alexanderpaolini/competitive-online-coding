const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const { setupWebSocket } = require('./routes/wsRoutes');
const { loadProblems } = require('./services/problemService');
const apiRoutes = require('./routes/apiRoutes');
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

const problems = loadProblems();

setupWebSocket(wss, problems);

// Routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    logger.log("RUNNING ON PORT", PORT);
});
