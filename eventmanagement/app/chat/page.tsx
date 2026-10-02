'use client'

import { useEffect, useRef, useState } from 'react'
import io, { Socket } from 'socket.io-client'

const Chat = () => {
  const socketRef = useRef<Socket | null>(null)
  const [messages, setMessages] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL

    if (!socketUrl) {
      setError('Realtime chat is not configured.')
      return
    }

    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    })

    socketRef.current = socket

    socket.on('message', (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg])
    })

    socket.on('messageError', (msg: string) => {
      setError(msg)
    })

    socket.on('connect_error', () => {
      setError('Unable to connect to realtime chat.')
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const normalized = message.trim()

    if (!normalized || !socketRef.current?.connected) {
      return
    }

    socketRef.current.emit('sendMessage', normalized)
    setMessage('')
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">Chat</h1>

        {error && (
          <p className="max-w-2xl mx-auto mb-4 p-3 rounded-lg bg-red-50 text-red-700">
            {error}
          </p>
        )}

        <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl mx-auto space-y-4">
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className="p-3 bg-gray-100 rounded-lg shadow-sm">
                <p className="text-gray-800 break-words">{msg}</p>
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
            maxLength={1000}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="w-full p-3 border rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chat
