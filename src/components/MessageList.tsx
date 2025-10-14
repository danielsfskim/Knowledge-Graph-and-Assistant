import React, { useEffect, useRef } from 'react';
import { Message as MessageType, useAIAssistant } from '../context/AIAssistantContext';
import { UserMessage } from './UserMessage';
import { AIResponse } from './AIResponse';
import { Loader2 } from 'lucide-react';
interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
}
export function MessageList({
  messages,
  isLoading
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);
  return <div className="space-y-6 pb-4">
      {messages.map(message => <div key={message.id}>
          {message.type === 'user' ? <UserMessage content={message.content} /> : <AIResponse id={message.id} content={message.content} complianceScore={message.complianceScore || 0} sources={message.sources || []} vote={message.vote} feedback={message.feedback} accepted={message.accepted} />}
        </div>)}
      {isLoading && <div className="flex items-start">
          <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-lg mr-3 mt-1 flex-shrink-0">
            G
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 max-w-3xl">
            <div className="flex items-center space-x-2">
              <Loader2 size={18} className="animate-spin text-blue-600" />
              <span className="text-gray-600">Searching knowledge base...</span>
            </div>
          </div>
        </div>}
      <div ref={messagesEndRef} />
    </div>;
}