const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// GET /api/games
router.get('/games', (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: gameController.export()
        });
    } catch (error) {
        console.error('Error fetching current games:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});

module.exports = router;
