import React, { useEffect, useState, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useAIAssistant } from '../context/AIAssistantContext';
export function ChatInput() {
  const {
    addUserMessage,
    isLoading,
    activeMode
  } = useAIAssistant();
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      addUserMessage(inputValue.trim());
      setInputValue('');
    }
  };
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);
  return <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end border border-gray-300 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <textarea ref={textareaRef} value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder={activeMode === 'chat' ? 'Ask a question or request a task...' : 'Type to search...'} className="flex-1 resize-none py-3 px-3 sm:px-4 outline-none text-gray-800 min-h-[52px] max-h-[120px] text-sm sm:text-base" rows={1} disabled={isLoading} onKeyDown={e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit(e);
        }
      }} />
        <button type="submit" disabled={!inputValue.trim() || isLoading} className={`p-2 sm:p-3 mr-1 mb-1 rounded-md ${!inputValue.trim() || isLoading ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'} touch-manipulation`} aria-label={isLoading ? 'Loading' : 'Send message'}>
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1 ml-1">
        {activeMode === 'chat' ? 'Press Enter to send, Shift+Enter for new line' : 'Press Enter to search'}
      </p>
    </form>;
}