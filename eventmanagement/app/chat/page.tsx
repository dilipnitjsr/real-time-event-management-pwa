'use client'
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket: ReturnType<typeof io>; // Correct type for socket

const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Initialize socket connection to the backend
    socket = io('http://localhost:5000'); // Backend URL

    socket.on('message', (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    socket.emit('sendMessage', message);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">Chat</h1>
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl mx-auto space-y-4">
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className="p-3 bg-gray-100 rounded-lg shadow-sm">
                <p className="text-gray-800">{msg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-200 border-t border-gray-300">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4 max-w-2xl mx-auto">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="w-full p-3 border rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
