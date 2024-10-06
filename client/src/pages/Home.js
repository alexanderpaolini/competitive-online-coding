import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';
import Cookies from 'js-cookie';

function Home() {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleStartGame = () => {
        // Set cookie for player name
        Cookies.set('playerName', name);
        navigate('/lobby');
    };

    return (
        <Container fluid className="bg-primary d-flex justify-content-center align-items-center min-vh-100">
            <Card className="p-4" style={{ maxWidth: '500px', width: '100%' }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4" style={{ fontFamily: 'Lucida-console, sans-serif', fontSize: '24px' }}>Competitive Online Coding</Card.Title>
                    <Card.Text className="text-center mb-4">1v1 coding. Finish first to win.</Card.Text>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onSubmit={handleStartGame}
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            className="w-100"
                            onClick={handleStartGame}
                            disabled={!name}  // Disable button if name is empty
                        >
                            Start Game
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Home;



