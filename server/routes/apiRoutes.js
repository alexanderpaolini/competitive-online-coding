const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/games', (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Game code is required' });
    }

    try {
        const newGame = gameController.createGame(code);

        return res.status(201).json({
            message: 'Game created successfully',
            game: newGame,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while creating the game' });
    }
});

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
