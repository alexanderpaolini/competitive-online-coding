// src/components/LobbyPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

function LobbyPage() {
    // const { lobbyName } = useParams();  // Retrieve lobbyName from URL parameters

    // Assuming you have a way to access the lobbies data (like from context or props)
    // const lobbies = {};  // Replace with your actual lobby data source
    // const lobby = lobbies[lobbyName];  // Access the specific lobby by name
    //
    // if (!lobby) {
    //     return <Container><h2>Lobby not found!</h2></Container>; // Handle undefined lobby
    // }

    const lobbyName = "1234"
    const lobby = {
        name: lobbyName
    }

    const handleStartGame = () => {
        // Logic to start the game goes here
        console.log(`Starting game in lobby: ${lobbyName}`);
    };

    return (
        <Container>
            <h1>Welcome to {lobby.name}</h1>
            <Button variant="primary" onClick={handleStartGame}>Start Game</Button>
        </Container>
    );
}

export default LobbyPage;








