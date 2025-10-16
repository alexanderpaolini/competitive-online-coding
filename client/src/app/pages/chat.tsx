import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Adjust the URL if necessary

export default function Chat() {
  const [messages, setMessages] = useState<{ sender: string, message: string }>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('message', { sender: 'Client', message: input });
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
