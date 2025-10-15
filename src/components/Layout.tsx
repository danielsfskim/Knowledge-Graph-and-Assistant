import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ChatInterface } from './ChatInterface';
import { ChatTabs } from './ChatTabs';
import { MenuIcon, XIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  return <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-0 left-0 z-50 md:hidden p-3">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md bg-white shadow-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
          {sidebarOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:sticky top-0 left-0 h-full ${sidebarCollapsed ? 'w-0 md:w-0 overflow-hidden' : 'w-[85%] sm:w-72 md:w-64'} transition-all duration-300 ease-in-out z-40 max-w-full`}>
        <Sidebar closeSidebar={() => setSidebarOpen(false)} toggleSidebar={toggleSidebar} isCollapsed={sidebarCollapsed} />
      </div>
      {/* Unhide button - only shows when sidebar is collapsed */}
      {sidebarCollapsed && <div className="hidden md:block fixed left-0 top-24 z-30">
          <button onClick={toggleSidebar} className="p-2 bg-white rounded-r-md shadow-md text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Show sidebar" title="Show sidebar">
            <ChevronRightIcon size={20} />
          </button>
        </div>}
      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col transition-all duration-300 w-full">
        {/* Add top padding on mobile to account for the toggle button */}
        <div className="h-12 md:h-0 block md:hidden"></div>
        <ChatTabs />
        <main className="flex-1 overflow-y-auto p-3 md:p-6">
          <ChatInterface />
        </main>
      </div>
      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>;
}