// src/pages/GamePage.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import MonacoEditor from "react-monaco-editor";

function GamePage() {
    const { lobbyCode } = useParams();
    const [code, setCode] = useState('// Write your code here\n'); // Initialize state with default value
    const [problem, setProblem] = useState('');
    const socketRef = useRef(null); // Create a ref to hold the WebSocket instance
    const [isGameStarted, setIsGameStarted] = useState(false); // Track game status

    useEffect(() => {
        // Create WebSocket connection once
        socketRef.current = new WebSocket('ws://localhost:3000');

        // Handle WebSocket events
        socketRef.current.onopen = () => {
            console.log('Connected to WebSocket');
            socketRef.current.send(JSON.stringify({ event:"JOIN_LOBBY", lobby: lobbyCode }));
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Message from server:', data);

            // Check for GAME_STATUS_UPDATE and update game state accordingly
            if (data.event === "GAME_STATUS_UPDATE" && data.status === "start") {
                console.log(data)
                setProblem(data.problem.identifier);
                setIsGameStarted(true); // Game has started, make UI visible
            }
        };

        return () => {
            socketRef.current.close(); // Close the socket when the component unmounts
        };
    }, [lobbyCode]);

    function handleCodeChange(newValue) {
        setCode(newValue); // Update the code state with the new value from Monaco editor
    }

    function handleSubmitButton(e) {
        e.preventDefault();

        // Prepare the message to send
        const message = {
            event: "SEND_CODE",
            code: code,
            language: "C",
            problem: problem
        };

        // Send the code through the existing WebSocket connection
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
            console.log('Code sent:', message);
        } else {
            console.error('WebSocket is not open. Message not sent:', message);
        }
    }

    function handleReadyButton(e) {
        e.preventDefault();

        // Send a PLAYER_STATUS_UPDATE message
        const message = {
            event: "PLAYER_STATUS_UPDATE",
            status: "READY"
        };

        // Send the ready status through the existing WebSocket connection
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
            console.log('Ready status sent:', message);
        } else {
            console.error('WebSocket is not open. Ready status not sent:', message);
        }
    }

    return (
        <div className={isGameStarted ? "" : "greyed-out"}>
            <Button onClick={handleReadyButton} disabled={isGameStarted}>
                READY
            </Button>
            <h1>Game: {lobbyCode}</h1>
            <p>Problem description goes here.</p>

            <MonacoEditor
                width="800"
                height="600"
                language="c"
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
                options={{
                    selectOnLineNumbers: true,
                    readOnly: !isGameStarted, // Disable editor when game hasn't started
                }}
                disabled={!isGameStarted}
            />

            <Button onClick={handleSubmitButton} disabled={!isGameStarted}>
                Submit
            </Button>
        </div>
    );
}

export default GamePage;
