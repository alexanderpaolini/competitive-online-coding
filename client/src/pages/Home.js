// src/pages/Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';

function Home() {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleStartGame = () => {
        // Set cookie
        // Cookies.set('playerName', name);
        navigate('/lobby');
    };

    return (
        <div className="home">
            <h1>Welcome to the Game</h1>
            <p>Description of the game goes here.</p>
            <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleStartGame}>Start Game</button>
        </div>
    );
}

export default Home;
