interface ChatMessageProps {
    user: string;
    text: string;
  }
  
  export default function ChatMessage({ user, text }: ChatMessageProps) {
    return (
      <div className="p-2 border rounded shadow">
        <strong>{user}: </strong>
        <span>{text}</span>
      </div>
    );
  }
  