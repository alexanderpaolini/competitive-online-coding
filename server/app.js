const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const { setupWebSocket } = require('./routes/wsRoutes');
const { loadProblems } = require('./services/problemService');
const apiRoutes = require('./routes/apiRoutes')

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Load problems from the filesystem
const problems = loadProblems();

// Set up WebSocket handlers
setupWebSocket(wss, problems);

// Use the API routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
