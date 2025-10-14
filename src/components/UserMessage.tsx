import React from 'react';
import { User } from 'lucide-react';
import { useAIAssistant } from '../context/AIAssistantContext';
interface UserMessageProps {
  content: string;
}
export function UserMessage({
  content
}: UserMessageProps) {
  const {
    personalization
  } = useAIAssistant();
  return <div className="flex items-start">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3 mt-1 flex-shrink-0">
        <User size={16} />
      </div>
      <div className="space-y-1 max-w-3xl">
        <div className="text-sm font-medium text-gray-700">
          {personalization.name} • {personalization.role} at{' '}
          {personalization.company}
        </div>
        <div className="text-gray-800">{content}</div>
      </div>
    </div>;
}