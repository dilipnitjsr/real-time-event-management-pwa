import { useState } from "react";

interface ChatInputProps {
  onSend: (user: string, text: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [user, setUser] = useState("");
  const [text, setText] = useState("");

  const handleSend = () => {
    if (user.trim() && text.trim()) {
      onSend(user, text);
      setText("");
    }
  };

  return (
    <div className="flex space-x-2 mt-4">
      <input
        type="text"
        placeholder="Your name"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        className="flex-1 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-2 p-2 border rounded"
      />
      <button onClick={handleSend} className="p-2 bg-blue-500 text-white rounded">
        Send
      </button>
    </div>
  );
}
