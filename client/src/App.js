// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import LobbyPage from './pages/Lobby';
import GamePage from './pages/Game';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lobby" element={<LobbyPage />} />
            <Route path="/games/:lobbyCode" element={<GamePage />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;
