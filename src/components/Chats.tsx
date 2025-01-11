import React, { useEffect, useRef } from 'react';
import Spinner from './Spinner/Spinner';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatsProps {
  messages: { sender: "user" | "AI"; text: string, type: "chat" | 'shell' }[];
  aiCmdLoading: boolean;
}

const Chats: React.FC<ChatsProps> = ({ messages, aiCmdLoading }) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the latest message whenever messages change
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!messages || messages.length === 0) return null;

  return (
    <div
      ref={chatContainerRef}
      className="chat-container flex flex-col gap-5 overflow-y-auto"
    >
      {messages.map((msg, index) => (
        <div
          key={index}
          ref={index === messages.length - 1 ? latestMessageRef : null} // Add ref to the latest message
          className="chat-message p-4 rounded-lg border border-slate-500 bg-bg-secondary"
        >
          <div className="font-bold text-blue-500">
            {msg.sender === "user" ? "You:" : "AI:"}
          </div>
          <div className="flex gap-3 items-center">
            {aiCmdLoading && msg.type === "shell" && index === messages.length - 1 && (
              <Spinner size="24px" />
            )}
            <Markdown remarkPlugins={[remarkGfm]}>{msg.text}</Markdown>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
