// src/pages/LobbyPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Container, Row, Col, ListGroup, Navbar } from 'react-bootstrap';
import Cookies from 'js-cookie';

function LobbyPage() {
    const [lobbyName, setLobbyName] = useState('');
    const [lobbies, setLobbies] = useState([]);
    const navigate = useNavigate();
    const playerName = Cookies.get('playerName'); // Retrieve the player name from the cookie

    // Fetching lobby data
    const fetchLobbies = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/games');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setLobbies(data.data);
        } catch (error) {
            console.error('Error fetching lobbies:', error);
        }
    };

    // Fetch lobbies when the component mounts
    useEffect(() => {
        fetchLobbies();
    }, []);

    const handleCreateLobby = async () => {
        // Create new lobby via POST request
        try {
            const response = await fetch('http://localhost:3000/api/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: lobbyName }),
            });
            if (!response.ok) {
                throw new Error('Failed to create lobby');
            }
            await response.json();

            // After successfully creating the lobby, clear the input
            setLobbyName('');

            // Fetch the updated list of lobbies after creating a new one
            fetchLobbies();
        } catch (error) {
            console.error('Error creating lobby:', error);
        }
    };

    const handleJoinLobby = (code) => {
        navigate(`/games/${code}`);
    };

    return (
        <Container>
            <Navbar className="justify-content-between">
                <Navbar.Brand>Lobby Selector</Navbar.Brand>
                <Navbar.Text>
                    Welcome, {playerName}!
                </Navbar.Text>
            </Navbar>

            <h1 className="text-center my-4">Lobby Selector</h1>
            <Row>
                {/* Left side - Create Lobby Form */}
                <Col md={4}>
                    <h2>Create Lobby</h2>
                    <Form>
                        <Form.Group controlId="formLobbyName">
                            <Form.Label>Lobby Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={lobbyName}
                                onChange={(e) => setLobbyName(e.target.value)}
                                placeholder="Enter lobby name"
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            onClick={handleCreateLobby}
                            className="mt-3"
                        >
                            Create Lobby
                        </Button>
                    </Form>
                </Col>

                {/* Right side - List of Lobbies */}
                <Col md={8}>
                    <h2>Available Lobbies</h2>
                    <ListGroup>
                        {lobbies.map((lobby, index) => (
                            <ListGroup.Item key={index}>
                                <Row className="align-items-center">
                                    <Col xs={8}>{lobby.code}</Col>
                                    <Col xs={4} className="text-end">
                                        <Button
                                            variant="success"
                                            onClick={() => handleJoinLobby(lobby.code)}
                                        >
                                            Join
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
}

export default LobbyPage;




