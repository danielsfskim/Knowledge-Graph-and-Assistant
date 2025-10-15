import React, { useState } from 'react';
import { Search, Book, FileText, Settings, HelpCircle, User, MessageSquare, ChevronDown, ChevronRight, Layers, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useAIAssistant } from '../context/AIAssistantContext';
import { PersonalizationSettings } from './PersonalizationSettings';
import { HomeSection } from './HomeSection';
interface SidebarProps {
  closeSidebar: () => void;
  toggleSidebar: () => void;
  isCollapsed: boolean;
}
export function Sidebar({
  closeSidebar,
  toggleSidebar,
  isCollapsed
}: SidebarProps) {
  const {
    clearMessages,
    selectedCategory,
    setSelectedCategory,
    createNewTab,
    renameTab,
    activeMode,
    chatTabs,
    switchTab
  } = useAIAssistant();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  // Simple categories array
  const categories = ['All', 'Getting Started', 'Account Management', 'Billing', 'Integrations', 'Security', 'Compliance Resources', 'Troubleshooting'];
  const handleCategorySelect = (category: string) => {
    // Check if a tab for this category already exists
    const categoryTabTitle = `${category} Chat`;
    const existingTab = chatTabs.find(tab => tab.title === categoryTabTitle);
    if (existingTab) {
      // If the tab already exists, just switch to it
      switchTab(existingTab.id);
    } else {
      // If no existing tab, create a new one
      const newTabId = createNewTab();
      // Update the tab title to match the category
      renameTab(newTabId, categoryTabTitle);
      // Set the selected category
      setSelectedCategory(category);
    }
    // Close the sidebar on mobile
    closeSidebar();
  };
  const handleNewChat = () => {
    clearMessages();
    closeSidebar();
  };
  return <div className="h-full flex flex-col bg-white border-r border-gray-200 shadow-sm">
      {/* Logo and toggle button */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            G
          </div>
          <span className="ml-2 font-semibold text-gray-800">
            Novo Unified Support
          </span>
        </div>
        {/* Collapse/Expand button moved to sidebar header */}
        <button onClick={toggleSidebar} className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          <ChevronLeftIcon size={18} />
        </button>
      </div>
      {/* Home Section with Search/Chat toggle */}
      <HomeSection />
      {/* New Chat Button - only show in chat mode */}
      {activeMode === 'chat' && <div className="p-4">
          <button onClick={handleNewChat} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors">
            <MessageSquare size={16} />
            <span>New Chat</span>
          </button>
        </div>}
      {/* Knowledge Categories */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between cursor-pointer mb-2" onClick={() => setCategoriesOpen(!categoriesOpen)}>
            <span className="text-sm font-medium text-gray-600">
              Knowledge Categories
            </span>
            {categoriesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
          {categoriesOpen && <div className="space-y-3">
              {categories.map(category => <button key={category} onClick={() => handleCategorySelect(category)} className="w-full text-left p-0 rounded-md transition-colors overflow-hidden">
                  <div className={`relative overflow-hidden rounded-md ${selectedCategory === category ? 'ring-2 ring-blue-500' : 'border border-gray-800'}`}>
                    {/* Background image with overlay */}
                    <div className="absolute inset-0 bg-cover bg-center" style={{
                backgroundImage: `url('https://uploadthingy.s3.us-west-1.amazonaws.com/hKbEfz42ybaR2eu5Z8GZSf/oleg-laptev-7jQh3EiS8Bs-unsplash.jpg')`
              }}></div>
                    {/* Overlay for better text readability */}
                    <div className={`absolute inset-0 ${selectedCategory === category ? 'bg-blue-600 bg-opacity-85' : 'bg-white bg-opacity-90'}`}></div>
                    {/* Content container */}
                    <div className="relative z-10 py-1.5 px-2">
                      <span className={`text-sm font-medium ${selectedCategory === category ? 'text-white' : 'text-gray-800'}`}>
                        {category}
                      </span>
                    </div>
                  </div>
                </button>)}
            </div>}
        </div>
      </div>
      {/* Settings */}
      <div className="p-4 border-t border-gray-200">
        <button onClick={() => setSettingsOpen(!settingsOpen)} className="w-full flex items-center justify-between text-gray-700 hover:text-gray-900 py-2">
          <div className="flex items-center gap-2">
            <Layers size={16} />
            <span>Integrations</span>
          </div>
          {settingsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {settingsOpen && <PersonalizationSettings />}
      </div>
    </div>;
}