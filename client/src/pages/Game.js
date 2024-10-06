import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Navbar } from 'react-bootstrap';
import MonacoEditor from "react-monaco-editor";
import Cookies from 'js-cookie';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import config from '../config';

function GamePage() {
    const { lobbyCode } = useParams();
    const [code, setCode] = useState('// Write your code here\n');
    const [isReadyVisible, setReadyVisible] = useState(true);
    const [cannotPlay, setCannotPlay] = useState(false);
    const [wlStatus, setwlStatus] = useState('');
    const [playStopped, setPlayStopped] = useState(false);
    const [problemMarkdown, setProblemMarkdown] = useState('');
    const socketRef = useRef(null);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const navigate = useNavigate();
    const playerName = Cookies.get('playerName');

    if (!playerName) navigate('/')

    useEffect(() => {
        socketRef.current = new WebSocket(config.wsURL);

        setProblemMarkdown("# Problem Description\n\nThe problem will be displayed when everyone presses READY");

        socketRef.current.onopen = () => {
            console.log('WS CONNECTED');
            const identifier = Cookies.get("playerName");
            console.log("NAME", identifier);
            socketRef.current.send(JSON.stringify({ event: "JOIN_LOBBY", lobby: lobbyCode, identifier: identifier }));
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("MESSAGE FROM SERVER", data);

            if (data.event === "GAME_STATUS_UPDATE" && data.status === "start") {
                setProblemMarkdown(data.problem.description);
                setIsGameStarted(true);
                return
            }

            if (data.event === "ERROR") {
                if (data.message === "GAME IN PROGRESS") {
                    setCannotPlay(true);
                }
                if (data.message === "GAME NOT FOUND") {
                    navigate('/lobby')
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
            socketRef.current.close();
        };
    }, [lobbyCode]);

    const handleGoHome = () => {
        navigate('/lobby');
    };

    function handleCodeChange(newValue) {
        setCode(newValue);
    }

    function handleSubmitButton(e) {
        e.preventDefault();

        setPlayStopped(true);

        const message = {
            event: "SEND_CODE",
            code: code,
            language: "C",
            problem: problemMarkdown
        };

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

        const message = {
            event: "PLAYER_STATUS_UPDATE",
            status: "READY"
        };

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
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

            <Row>
                <Col md={6}>
                    <div style={{ backgroundColor: '#f0f0f0', borderRadius: '5px', padding: '10px' }}>
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
                            readOnly: !isGameStarted,
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







