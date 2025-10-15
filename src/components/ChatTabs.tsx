import React from 'react';
import { PlusIcon, X } from 'lucide-react';
import { useAIAssistant } from '../context/AIAssistantContext';
export function ChatTabs() {
  const {
    chatTabs,
    activeTabId,
    createNewTab,
    switchTab,
    closeTab
  } = useAIAssistant();
  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation(); // Prevent tab activation when clicking close button
    closeTab(tabId);
  };
  return <div className="flex items-center bg-gray-100 border-b border-gray-200 overflow-x-auto py-0.5">
      <div className="flex-1 flex">
        {chatTabs.map(tab => <div key={tab.id} onClick={() => switchTab(tab.id)} className={`flex items-center min-w-[120px] max-w-[180px] h-10 px-2 py-1 border-r border-gray-200 cursor-pointer group ${activeTabId === tab.id ? 'bg-white text-gray-800 border-b-0' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <span className="truncate flex-1 text-xs sm:text-sm">
              {tab.title}
            </span>
            <button onClick={e => handleCloseTab(e, tab.id)} className={`ml-1 p-1 rounded-full ${activeTabId === tab.id ? 'text-gray-500 hover:bg-gray-200' : 'text-gray-400 hover:bg-gray-300'} opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity`} aria-label="Close tab">
              <X size={14} />
            </button>
          </div>)}
      </div>
      <button onClick={createNewTab} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 flex items-center justify-center flex-shrink-0" aria-label="New tab">
        <PlusIcon size={18} />
      </button>
    </div>;
}