import React from 'react';
import { ChatInput } from './ChatInput';
import { MessageList } from './MessageList';
import { KnowledgePanel } from './KnowledgePanel';
import { useAIAssistant } from '../context/AIAssistantContext';
import { X } from 'lucide-react';
import { SearchInterface } from './SearchInterface';
export function ChatInterface() {
  const {
    getActiveMessages,
    isLoading,
    activeTabId,
    closeTab,
    chatTabs,
    activeMode
  } = useAIAssistant();
  const messages = getActiveMessages();
  const handleCloseTab = () => {
    if (chatTabs.length > 1) {
      closeTab(activeTabId);
    }
  };
  // Return the search interface if in search mode
  if (activeMode === 'search') {
    return <SearchInterface />;
  }
  // Otherwise, return the chat interface
  return <div className="h-full flex flex-col">
      {messages.length === 0 ? <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              New Conversation
            </h2>
            {chatTabs.length > 1 && <button onClick={handleCloseTab} className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100" aria-label="Close tab">
                <X size={18} />
              </button>}
          </div>
          <EmptyState />
        </div> : <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-4">
          <div className="flex-1 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {chatTabs.find(tab => tab.id === activeTabId)?.title}
              </h2>
              {chatTabs.length > 1 && <button onClick={handleCloseTab} className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100" aria-label="Close tab">
                  <X size={18} />
                </button>}
            </div>
            <MessageList messages={messages} isLoading={isLoading} />
          </div>
          <div className="w-full md:w-72 lg:w-80 shrink-0">
            <KnowledgePanel />
          </div>
        </div>}
      <div className="mt-4">
        <ChatInput />
      </div>
    </div>;
}
function EmptyState() {
  const {
    selectedCategory,
    addUserMessage
  } = useAIAssistant();
  // Define category-specific suggestion buttons
  const categorySuggestions = {
    All: ['How do I get started with Novo?', 'What makes Novo different from other banks?', 'Can I use Novo for my small business?', 'What customer support options are available?'],
    'Getting Started': ['How do I create a Novo account?', 'What documents do I need to open an account?', 'How long does account approval take?', 'How do I download the mobile app?'],
    'Account Management': ['How do I update my business address?', 'How do I order a replacement debit card?', 'How do I view my account statements?', 'Can I add multiple users to my account?'],
    Billing: ['What fees does Novo charge?', 'Are there any monthly maintenance fees?', 'How do I dispute a transaction?', "What's Novo's overdraft policy?"],
    Integrations: ['How do I connect QuickBooks?', 'Can I integrate with Shopify?', 'How does the Stripe integration work?', 'What accounting software does Novo support?'],
    Security: ['How do I enable two-factor authentication?', 'What security measures does Novo use?', 'How do I report suspicious activity?', 'Are my deposits FDIC insured?'],
    'Compliance Resources': ['What are the KYC requirements?', "Explain Novo's AML policy", 'What transaction monitoring is required?', 'How does Novo handle OFAC compliance?'],
    Troubleshooting: ['Why was my transfer declined?', "I can't log into my account", 'My mobile app is not working', "Why haven't I received my debit card?"]
  };
  // Get the suggestions for the selected category or default to "All"
  const suggestions = categorySuggestions[selectedCategory] || categorySuggestions['All'];
  return <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
        <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
          G
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Novo Assistant
      </h2>
      <p className="text-gray-600 mb-6 max-w-md">
        {selectedCategory === 'All' ? "Ask me anything about Novo's platform and I'll help you find the answers." : `Ask me anything about ${selectedCategory} and I'll help you find the answers.`}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
        {suggestions.map((text, index) => <SuggestionButton key={index} text={text} />)}
      </div>
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-lg">
        <h3 className="font-medium text-gray-700 mb-2">
          What can I help with?
        </h3>
        <ul className="text-sm text-gray-600 text-left space-y-2">
          <li className="flex items-start">
            <span className="inline-block bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 text-xs">
              ✓
            </span>
            <span>Answer questions about company documents and resources</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 text-xs">
              ✓
            </span>
            <span>Summarize long documents or project status</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 text-xs">
              ✓
            </span>
            <span>
              Draft emails or create reports based on knowledge base content
            </span>
          </li>
          <li className="flex items-start">
            <span className="inline-block bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 text-xs">
              ✓
            </span>
            <span>
              Provide citations to source information for verification
            </span>
          </li>
        </ul>
      </div>
    </div>;
}
function SuggestionButton({
  text
}: {
  text: string;
}) {
  const {
    addUserMessage
  } = useAIAssistant();
  return <button onClick={() => addUserMessage(text)} className="p-3 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors">
      {text}
    </button>;
}