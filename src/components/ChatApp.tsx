import { useState } from 'react';
import { useDuplexerConsumer } from '../hooks/use-duplexer-consumer';

export default function ChatApp() {
  const host = (globalThis as any).__wix_context__?.host;
  const [channelName, setChannelName] = useState('test-channel');
  const [messageInput, setMessageInput] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const { messages: duplexerMessages, isConnected } = useDuplexerConsumer({ host, channelName });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !channelName.trim()) {
      setPublishError('Please enter both channel name and message');
      return;
    }

    setIsPublishing(true);
    setPublishError(null);

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelName,
          message: messageInput,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish message');
      }

      setMessageInput('');
      console.log('Message published successfully:', data);
    } catch (error) {
      console.error('Error publishing message:', error);
      setPublishError(error instanceof Error ? error.message : 'Failed to publish message');
    } finally {
      setIsPublishing(false);
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Chat App</h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.25rem 0.75rem',
          backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
          color: isConnected ? '#155724' : '#721c24',
          borderRadius: '20px',
          fontSize: '0.875rem',
          fontWeight: 'bold'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isConnected ? '#28a745' : '#dc3545'
          }} />
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      
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

        {publishError && (
          <div style={{
            padding: '0.5rem',
            marginBottom: '1rem',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            fontSize: '0.875rem'
          }}>
            {publishError}
          </div>
        )}

        <button
          type="submit"
          disabled={isPublishing || !channelName.trim() || !messageInput.trim()}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: isPublishing ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: isPublishing ? 'not-allowed' : 'pointer',
            opacity: (!channelName.trim() || !messageInput.trim()) ? 0.6 : 1
          }}
        >
          {isPublishing ? 'Publishing...' : 'Publish Message'}
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
        <h3 style={{ marginTop: 0, fontSize: '1rem' }}>
          Messages from Duplexer {channelName && `(${channelName})`}:
        </h3>
        {duplexerMessages.length === 0 ? (
          <p style={{ color: '#999' }}>
            {channelName ? 'No messages yet. Waiting for events...' : 'Enter a channel name to start listening'}
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {duplexerMessages.map((msg, idx) => (
              <li key={idx} style={{
                padding: '0.5rem',
                marginBottom: '0.5rem',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                wordBreak: 'break-word'
              }}>
                {typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

