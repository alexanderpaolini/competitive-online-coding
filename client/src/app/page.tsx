'use client'
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

export default function Chat() {
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [input, setInput] = useState('');
  const socketRef = useRef<any>(null); // Use useRef to keep a reference to the socket

  useEffect(() => {
    // Initialize the socket connection
    socketRef.current = io('http://localhost:3000/game'); // Adjust the URL if necessary

    socketRef.current.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socketRef.current.emit('message', { sender: 'Client', message: input });
      setInput('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Chat Room</h1>
      <div style={{ maxHeight: '400px', overflowY: 'scroll', marginBottom: '10px', border: '1px solid #ccc' }}>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        style={{ width: '80%' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
