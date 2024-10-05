// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CodeEditor from './components/CodeEditor';
import LobbyPage from './components/LobbyPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<CodeEditor />} />
            <Route path="/lobby/:lobbyName" element={<LobbyPage />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;








