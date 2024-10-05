// src/components/CodeEditor.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MonacoEditor from 'react-monaco-editor';
import { Container } from 'react-bootstrap';

function CodeEditor() {
    const { lobbyName } = useParams(); // Get the lobby name from the URL
    const [code, setCode] = useState('// Write your code here\n');

    const handleCodeChange = (newValue) => {
        setCode(newValue); // Update code state on editor change
    };

    return (
        <Container className="mt-5">
            <MonacoEditor
                width="800"
                height="600"
                language="c"
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
                options={{
                    selectOnLineNumbers: true,
                }}
            />
        </Container>
    );
}

export default CodeEditor;
