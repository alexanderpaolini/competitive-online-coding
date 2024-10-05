// src/pages/Lobby.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

function LobbyPage() {
    const [lobbyName, setLobbyName] = useState('');
    const [lobbies, setLobbies] = useState([]);
    const navigate = useNavigate();

    // Fetching lobby data on component mount
    useEffect(() => {
        const fetchLobbies = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/games');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                // Assuming the API returns an array of lobby names
                console.log(data.data)
                setLobbies(data.data);
            } catch (error) {
                console.error('Error fetching lobbies:', error);
            }
        };

        fetchLobbies();
    }, []); // Empty dependency array means this effect runs once when the component mounts

    const handleCreateLobby = () => {
        // Logic to create a new lobby (e.g., POST request to /games)
        // Here we will just simulate adding a lobby
        setLobbies([...lobbies, lobbyName]);
        setLobbyName('');
    };

    const handleJoinLobby = (name) => {
        navigate(`/games/${name}`);
    };

    return (
        <div>
            <h1>Lobby Selector</h1>
            <Form>
                <Form.Group>
                    <Form.Label>Create Lobby</Form.Label>
                    <Form.Control
                        type="text"
                        value={lobbyName}
                        onChange={(e) => setLobbyName(e.target.value)}
                        placeholder="Enter lobby name"
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleCreateLobby}>
                    Create Lobby
                </Button>
            </Form>

            <h2>Available Lobbies</h2>
            <ul>
                {lobbies.map((x, index) => (
                    <li key={index}>
                        <Button onClick={() => handleJoinLobby(x.code)}>
                            {x.code}
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LobbyPage;
