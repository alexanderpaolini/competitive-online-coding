// src/components/CodeEditor.js
import React, { useState } from 'react';
import { Route, Routes, Link, Navigate } from 'react-router-dom';
import { Container, Button, Row, Col, Form } from 'react-bootstrap';
import LobbyPage from './LobbyPage'; // Ensure this path is correct
import Editor from '@monaco-editor/react'; // Assuming you are using Monaco Editor

function CodeEditor() {
    const [lobbyName, setLobbyName] = useState('');
    const [lobbies, setLobbies] = useState({});
    const [selectedLobby, setSelectedLobby] = useState('');
    const [code, setCode] = useState('// Write your C code here');
    const [output, setOutput] = useState('');

    const handleCreateLobby = (event) => {
        event.preventDefault();
        if (lobbyName && !lobbies[lobbyName]) {
            setLobbies((prev) => ({
                ...prev,
                [lobbyName]: { name: lobbyName, code: '// Write your C code here' },
            }));
            setLobbyName('');
        }
    };

    const handleLobbyChange = (event) => {
        setSelectedLobby(event.target.value);
    };

    const handleRunCode = async () => {
        // Logic for running the code goes here
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center">Remote Code Compiler</h1>

            <Row className="mb-4">
                <Col>
                    <Form onSubmit={handleCreateLobby}>
                        <Form.Group controlId="lobbyName">
                            <Form.Label>Create Lobby</Form.Label>
                            <Form.Control
                                type="text"
                                value={lobbyName}
                                onChange={(e) => setLobbyName(e.target.value)}
                                placeholder="Enter lobby name"
                            />
                        </Form.Group>
                        <Button variant="success" type="submit">Create Lobby</Button>
                    </Form>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Form.Group controlId="lobbySelect">
                        <Form.Label>Select Lobby</Form.Label>
                        <Form.Control as="select" onChange={handleLobbyChange} value={selectedLobby}>
                            <option value="">Select a lobby</option>
                            {Object.entries(lobbies).map(([key, { name }]) => (
                                <option key={key} value={key}>{name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>

            <Row className="text-center mb-4">
                <Col>
                    {selectedLobby && <Navigate to={`/lobby/${selectedLobby}`} />}
                    <Link to={`/lobby/${selectedLobby}`}>
                        <Button variant="primary" disabled={!selectedLobby}>Go to Lobby</Button>
                    </Link>
                </Col>
            </Row>

            <Routes>
                {Object.entries(lobbies).map(([key, lobby]) => (
                    <Route key={key} path={`/lobby/${key}`} element={<LobbyPage lobby={lobby} />} />
                ))}
                <Route path="/editor/:lobbyName" element={<CodeSandbox code={code} output={output} handleRunCode={handleRunCode} setCode={setCode} />} />
                <Route path="/" element={<Navigate to="/" />} />
            </Routes>
        </Container>
    );
}

function CodeSandbox({ code, output, handleRunCode, setCode }) {
    return (
        <div>
            <h2>Code Editor</h2>
            <Editor
                height="400px"
                defaultLanguage="c"
                value={code}
                onChange={(newValue) => setCode(newValue)}
            />
            <Button variant="primary" onClick={handleRunCode}>Run Code</Button>
            <h3>Output:</h3>
            <pre>{output}</pre>
        </div>
    );
}

export default CodeEditor;













