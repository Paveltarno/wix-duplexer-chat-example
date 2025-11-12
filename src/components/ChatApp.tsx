import { useState } from 'react';

export default function ChatApp() {
  const [channelName, setChannelName] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && channelName.trim()) {
      setMessages([...messages, `[${channelName}] ${messageInput}`]);
      setMessageInput('');
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '1rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ marginTop: 0 }}>Chat App</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="channel" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Channel Name:
          </label>
          <input
            id="channel"
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Enter channel name"
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Message:
          </label>
          <input
            id="message"
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message"
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#d83333',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Submit
        </button>
      </form>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '4px',
        minHeight: '150px',
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
        <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Messages:</h3>
        {messages.length === 0 ? (
          <p style={{ color: '#999' }}>No messages yet</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {messages.map((msg, idx) => (
              <li key={idx} style={{
                padding: '0.5rem',
                marginBottom: '0.5rem',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px'
              }}>
                {msg}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

