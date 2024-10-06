import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {Button, Container, Row, Col, Navbar} from 'react-bootstrap';
import MonacoEditor from "react-monaco-editor";
import Cookies from 'js-cookie';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';  // To enable GitHub-flavored markdown (tables, etc.)


function GamePage() {
    const { lobbyCode } = useParams();
    const [code, setCode] = useState('// Write your code here\n'); // Initialize state with default value
    const [isReadyVisible, setReadyVisible] = useState(true);
    const [cannotPlay, setCannotPlay] = useState(false);
    const [wlStatus, setwlStatus] = useState('');
    const [playStopped, setPlayStopped] = useState(false);
    const [problemMarkdown, setProblemMarkdown] = useState('');  // To store the markdown content
    const socketRef = useRef(null); // Create a ref to hold the WebSocket instance
    const [isGameStarted, setIsGameStarted] = useState(false); // Track game status
    const navigate = useNavigate();
    const playerName = Cookies.get('playerName');

    useEffect(() => {
        // Create WebSocket connection once
        socketRef.current = new WebSocket('ws://172.20.10.2:3000');

        setProblemMarkdown("# Problem Description\n\nThe problem will be displayed when everyone presses READY");

        // Handle WebSocket events
        socketRef.current.onopen = () => {
            console.log('Connected to WebSocket');
            const identifier = Cookies.get("playerName");
            console.log(identifier);
            socketRef.current.send(JSON.stringify({ event: "JOIN_LOBBY", lobby: lobbyCode, identifier: identifier }));
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Message from server:', data);

            // Check for GAME_STATUS_UPDATE and update game state accordingly
            if (data.event === "GAME_STATUS_UPDATE" && data.status === "start") {
                console.log(data);
                setProblemMarkdown(data.problem.description);  // Fetch the markdown problem description
                setIsGameStarted(true); // Game has started, make UI visible
                return
            }

            if (data.event === "ERROR") {
                if (data.message === "GAME IN PROGRESS") {
                    setCannotPlay(true);
                }
                return
            }

            if (data.event === "GAME_STATUS_UPDATE") {
                if (data.status === "end") {
                    if (data.result === 'win') {
                        setwlStatus("WON")
                    } else if (data.result === 'lose') {
                        setwlStatus("LOST")
                    }
                }
            }

            if (data.event === "SUBMISSION_RESPONSE") {
                setPlayStopped(false);
            }
        };

        return () => {
            socketRef.current.close(); // Close the socket when the component unmounts
        };
    }, [lobbyCode]);

    const handleGoHome = () => {
        navigate('/lobby'); // Redirect to lobby page
    };

    function handleCodeChange(newValue) {
        setCode(newValue); // Update the code state with the new value from Monaco editor
    }

    function handleSubmitButton(e) {
        e.preventDefault();

       setPlayStopped(true); 

        // Prepare the message to send
        const message = {
            event: "SEND_CODE",
            code: code,
            language: "C",
            problem: problemMarkdown
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

        setReadyVisible(false);
        setProblemMarkdown('`loading...`')

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
        <Container>

            <Navbar className="justify-content-between">
                <Navbar.Brand>Game</Navbar.Brand>
                <Navbar.Text>
                    Welcome, {playerName}!
                </Navbar.Text>
            </Navbar>

            {cannotPlay && (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        backgroundColor: "rgba(128, 128, 128, 0.7)",
                        width: '100vw',
                        height: '100vh',
                        zIndex: 1000,
                    }}
                >
                    <div className="text-center">
                        <h2 style={{ color: 'white' }}>GAME IN PROGRESS</h2>
                        <Button variant="primary" onClick={handleGoHome}>
                            GO HOME
                        </Button>
                    </div>
                </div>
            )}

            {(wlStatus || playStopped) && (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        backgroundColor: "rgba(128, 128, 128, 0.7)",
                        width: '100vw',
                        height: '100vh',
                        zIndex: 1000,
                    }}
                >
                    {wlStatus && (
                        <div className="text-center">
                        <h2 style={{ color: 'white' }}>GAME OVER. YOU {wlStatus}!</h2>
                        <Button variant="primary" onClick={handleGoHome}>
                            GO HOME
                        </Button>
                    </div>)}
                </div>
            )}

            <h1 className="text-center my-4">Game Code: {lobbyCode}</h1>

            {/*WE NEED*/}
            {/*1. When the game is started (i.e. there will be an ERROR sent) it should be greyed out*/}
            {/*2. When the game is over it should display status (win, loss from websocket) and it should be greyed out or somehting*/}
            {/*3. A header to display user info if possible. We can start with name at the moment.*/}

             {/*Row for Problem Description and Coding Sandbox*/}
            <Row>
                <Col md={6}>
                    <div style={{backgroundColor: '#f0f0f0', borderRadius: '5px', padding: '10px'}}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {problemMarkdown}
                    </ReactMarkdown>
                    </div>

                    {isReadyVisible && (<Button
                        variant="success" // Green button
                        onClick={handleReadyButton}
                        disabled={isGameStarted}
                        className="mt-3"
                    >
                        READY
                    </Button>)}
                </Col>
                <Col md={6}>
                    <MonacoEditor
                        width="100%"
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
                    <Button
                        className="mt-3"
                        onClick={handleSubmitButton}
                        disabled={!isGameStarted}
                    >
                        Submit
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default GamePage;







