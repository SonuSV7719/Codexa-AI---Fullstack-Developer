import React from 'react'

interface ChatsProps {
  messages: { sender: "user" | "AI"; text: string }[]; // Messages array
}

const Chats: React.FC<ChatsProps> = ({ messages }) => {
  if (!messages || messages.length === 0) return null;

  return (
    <div className=' flex flex-col gap-5'>
      {messages.map((msg, index) => (
        <div
          key={index}
          className="chat-message p-4 rounded-lg border border-slate-500 bg-bg-secondary"
        >
          <div className="font-bold text-blue-500">
            {msg.sender === "user" ? "You:" : "AI:"}
          </div>
          <p className="text-white">{msg.text}</p>
        </div>
      ))}
    </div>
  );
};

export default Chats;
