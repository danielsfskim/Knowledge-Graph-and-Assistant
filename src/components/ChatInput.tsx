import React, { useEffect, useState, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useAIAssistant } from '../context/AIAssistantContext';
export function ChatInput() {
  const {
    addUserMessage,
    isLoading,
    activeMode,
    activeTabId
  } = useAIAssistant();
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentInputValue = inputValues[activeTabId] || '';
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInputValue.trim() && !isLoading) {
      addUserMessage(currentInputValue.trim());
      // Clear only the current tab's input
      setInputValues(prev => ({
        ...prev,
        [activeTabId]: ''
      }));
    }
  };
  const handleInputChange = (value: string) => {
    setInputValues(prev => ({
      ...prev,
      [activeTabId]: value
    }));
  };
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [currentInputValue]);
  return <form onSubmit={handleSubmit} className="sticky top-0 z-10 bg-gray-50 pt-3 pb-1 px-2 shadow-sm">
      <div className="flex items-end border border-gray-300 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <textarea ref={textareaRef} value={currentInputValue} onChange={e => handleInputChange(e.target.value)} placeholder={activeMode === 'chat' ? 'Ask a question...' : 'Search...'} className="flex-1 resize-none py-3 px-3 sm:px-4 outline-none text-gray-800 min-h-[52px] max-h-[120px] text-sm sm:text-base" rows={1} disabled={isLoading} onKeyDown={e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit(e);
        }
      }} />
        <button type="submit" disabled={!currentInputValue.trim() || isLoading} className={`p-2 sm:p-3 mr-1 mb-1 rounded-md ${!currentInputValue.trim() || isLoading ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'} touch-manipulation`} aria-label={isLoading ? 'Loading' : 'Send message'}>
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1 ml-1">
        {activeMode === 'chat' ? 'Press Enter to send, Shift+Enter for new line' : 'Press Enter to search'}
      </p>
    </form>;
}