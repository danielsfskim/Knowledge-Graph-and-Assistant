import React from 'react';
import { Search, MessageSquare, Home as HomeIcon } from 'lucide-react';
import { useAIAssistant } from '../context/AIAssistantContext';
export function HomeSection() {
  const {
    activeMode,
    setActiveMode,
    createNewTab
  } = useAIAssistant();
  const handleModeChange = (mode: 'search' | 'chat') => {
    setActiveMode(mode);
    if (mode === 'chat') {
      // Create a new chat tab when switching to chat mode
      createNewTab();
    }
  };
  return <div className="p-4 border-b border-gray-200">
      <div className="flex items-center mb-3">
        <HomeIcon size={16} className="text-gray-600 mr-2" />
        <h3 className="text-sm font-medium text-gray-700">Home</h3>
      </div>
      <div className="bg-gray-100 rounded-md p-1 flex">
        <button onClick={() => handleModeChange('search')} className={`flex items-center justify-center flex-1 py-2 px-3 rounded-md text-sm ${activeMode === 'search' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>
          <Search size={16} className="mr-1.5" />
          Search
        </button>
        <button onClick={() => handleModeChange('chat')} className={`flex items-center justify-center flex-1 py-2 px-3 rounded-md text-sm ${activeMode === 'chat' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>
          <MessageSquare size={16} className="mr-1.5" />
          Chat
        </button>
      </div>
      <p className="mt-3 text-xs text-gray-500">
        {activeMode === 'search' ? 'Search your company knowledge base with natural language queries.' : 'Have a conversation with AI and get answers from your knowledge base.'}
      </p>
    </div>;
}