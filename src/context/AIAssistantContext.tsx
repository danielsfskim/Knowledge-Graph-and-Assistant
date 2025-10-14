import React, { useState, createContext, useContext } from 'react';
import { mockKnowledgeBase, teamMembers } from '../utils/mockData';
import { semanticSearch, generateResponse } from '../utils/semanticSearch';
export type MessageType = 'user' | 'ai';
export type VoteType = 'upvote' | 'downvote' | null;
export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  complianceScore?: number;
  sources?: Source[];
  vote?: VoteType;
  feedback?: string;
  accepted?: boolean;
}
export interface Source {
  title: string;
  url: string;
  relevance: number;
}
export interface ChatTab {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}
interface AIAssistantContextType {
  chatTabs: ChatTab[];
  activeTabId: string;
  isLoading: boolean;
  addUserMessage: (content: string) => void;
  addAIResponse: (content: string, complianceScore: number, sources: Source[]) => void;
  updateMessage: (id: string, content: string) => void;
  voteOnMessage: (id: string, vote: VoteType) => void;
  acceptMessage: (id: string, accepted: boolean) => void;
  addFeedback: (id: string, feedback: string) => void;
  clearMessages: () => void;
  currentQuery: string;
  setCurrentQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  personalization: {
    name: string;
    role: string;
    company: string;
  };
  updatePersonalization: (field: 'name' | 'role' | 'company', value: string) => void;
  searchKnowledgeBase: (query: string) => any;
  recentSearchResults: any;
  createNewTab: () => string;
  switchTab: (tabId: string) => void;
  closeTab: (tabId: string) => void;
  renameTab: (tabId: string, newTitle: string) => void;
  getActiveMessages: () => Message[];
  selectedOwners: string[];
  toggleOwner: (owner: string) => void;
  selectAllOwners: () => void;
  unselectAllOwners: () => void;
  activeMode: 'search' | 'chat';
  setActiveMode: (mode: 'search' | 'chat') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  executeSearch: (query: string) => void;
  searchResults: any;
}
const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);
export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (!context) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
};
export const AIAssistantProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [chatTabs, setChatTabs] = useState<ChatTab[]>([{
    id: '1',
    title: 'New Chat',
    messages: [],
    createdAt: new Date()
  }]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [recentSearchResults, setRecentSearchResults] = useState<any>(null);
  const [personalization, setPersonalization] = useState({
    name: 'John Doe',
    role: 'Product Manager',
    company: 'Acme Inc.'
  });
  // Initialize with all team members selected
  const [selectedOwners, setSelectedOwners] = useState<string[]>(teamMembers.map(member => member.name));
  // New state for the Home feature
  const [activeMode, setActiveMode] = useState<'search' | 'chat'>('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  // Function to execute a search and update results
  const executeSearch = (query: string) => {
    setIsLoading(true);
    // Use the same search function but store results separately
    const results = searchKnowledgeBase(query);
    setSearchResults(results);
    setIsLoading(false);
    return results;
  };
  const toggleOwner = (owner: string) => {
    setSelectedOwners(prev => {
      if (prev.includes(owner)) {
        return prev.filter(o => o !== owner);
      } else {
        return [...prev, owner];
      }
    });
  };
  const selectAllOwners = () => {
    setSelectedOwners(teamMembers.map(member => member.name));
  };
  const unselectAllOwners = () => {
    setSelectedOwners([]);
  };
  // Function to search the knowledge base
  const searchKnowledgeBase = (query: string) => {
    // Filter knowledge base by category if not "All"
    let filteredKnowledgeBase = selectedCategory === 'All' ? mockKnowledgeBase : mockKnowledgeBase.filter(article => article.category === selectedCategory);
    // Further filter by selected owners
    if (selectedOwners.length > 0 && selectedOwners.length < teamMembers.length) {
      filteredKnowledgeBase = filteredKnowledgeBase.filter(article => article.owner && selectedOwners.includes(article.owner));
    }
    // Perform semantic search
    const results = semanticSearch(query, filteredKnowledgeBase);
    setRecentSearchResults(results);
    return results;
  };
  const getActiveMessages = () => {
    const activeTab = chatTabs.find(tab => tab.id === activeTabId);
    return activeTab ? activeTab.messages : [];
  };
  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    setChatTabs(prevTabs => prevTabs.map(tab => tab.id === activeTabId ? {
      ...tab,
      messages: [...tab.messages, newMessage],
      title: content.length > 20 ? content.substring(0, 20) + '...' : content
    } : tab));
    setIsLoading(true);
    setCurrentQuery(content);
    // Use setTimeout to simulate API call delay
    setTimeout(() => {
      generateAIResponse(content);
    }, 1500);
  };
  const generateAIResponse = (query: string) => {
    // Search the knowledge base with the query
    const searchResults = searchKnowledgeBase(query);
    // Generate a response based on search results
    const response = generateResponse(query, searchResults);
    // Add personalization to the response if applicable
    const personalizedResponse = personalizeResponse(response.content, personalization);
    // Add the AI response to the chat
    addAIResponse(personalizedResponse, response.complianceScore, response.sources);
  };
  // Helper function to personalize responses when appropriate
  const personalizeResponse = (content: string, personalization: {
    name: string;
    role: string;
    company: string;
  }) => {
    // Only personalize if we have a name and it's not the default
    if (personalization.name !== 'John Doe' && !content.includes(personalization.name)) {
      // Add personalization at the beginning for certain types of responses
      if (content.startsWith("I'd be happy") || content.startsWith('Thank you') || content.startsWith('I understand')) {
        return `Hi ${personalization.name}! ${content}`;
      }
    }
    return content;
  };
  const addAIResponse = (content: string, complianceScore: number, sources: Source[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content,
      timestamp: new Date(),
      complianceScore,
      sources,
      vote: null,
      accepted: false
    };
    setChatTabs(prevTabs => prevTabs.map(tab => tab.id === activeTabId ? {
      ...tab,
      messages: [...tab.messages, newMessage]
    } : tab));
    setIsLoading(false);
  };
  const updateMessage = (id: string, content: string) => {
    setChatTabs(prevTabs => prevTabs.map(tab => tab.id === activeTabId ? {
      ...tab,
      messages: tab.messages.map(msg => msg.id === id ? {
        ...msg,
        content,
        accepted: true // Auto-accept edited messages
      } : msg)
    } : tab));
  };
  // New function to handle accepting messages
  const acceptMessage = (id: string, accepted: boolean) => {
    setChatTabs(prevTabs => prevTabs.map(tab => tab.id === activeTabId ? {
      ...tab,
      messages: tab.messages.map(msg => msg.id === id ? {
        ...msg,
        accepted
      } : msg)
    } : tab));
  };
  // Function to handle upvoting and downvoting
  const voteOnMessage = (id: string, vote: VoteType) => {
    setChatTabs(prevTabs => prevTabs.map(tab => tab.id === activeTabId ? {
      ...tab,
      messages: tab.messages.map(msg => msg.id === id ? {
        ...msg,
        vote: msg.vote === vote ? null : vote // Toggle vote if clicking the same button
      } : msg)
    } : tab));
  };
  // Function to add detailed feedback for a message
  const addFeedback = (id: string, feedback: string) => {
    setChatTabs(prevTabs => prevTabs.map(tab => tab.id === activeTabId ? {
      ...tab,
      messages: tab.messages.map(msg => msg.id === id ? {
        ...msg,
        feedback
      } : msg)
    } : tab));
  };
  const clearMessages = () => {
    setChatTabs(prevTabs => prevTabs.map(tab => tab.id === activeTabId ? {
      ...tab,
      messages: [],
      title: 'New Chat'
    } : tab));
    setRecentSearchResults(null);
  };
  const createNewTab = () => {
    const newTabId = Date.now().toString();
    setChatTabs(prevTabs => [...prevTabs, {
      id: newTabId,
      title: 'New Chat',
      messages: [],
      createdAt: new Date()
    }]);
    setActiveTabId(newTabId);
    return newTabId; // Return the new tab ID so it can be used by the caller
  };
  const switchTab = (tabId: string) => {
    setActiveTabId(tabId);
  };
  const closeTab = (tabId: string) => {
    // Don't close the tab if it's the only one
    if (chatTabs.length <= 1) {
      return;
    }
    setChatTabs(prevTabs => prevTabs.filter(tab => tab.id !== tabId));
    // If closing the active tab, switch to another tab
    if (tabId === activeTabId) {
      const remainingTabs = chatTabs.filter(tab => tab.id !== tabId);
      if (remainingTabs.length > 0) {
        // Find the tab to the left, or if none, the first tab
        const tabIndex = chatTabs.findIndex(tab => tab.id === tabId);
        const newActiveTab = tabIndex > 0 ? chatTabs[tabIndex - 1] : remainingTabs[0];
        setActiveTabId(newActiveTab.id);
      }
    }
  };
  const renameTab = (tabId: string, newTitle: string) => {
    setChatTabs(prevTabs => prevTabs.map(tab => tab.id === tabId ? {
      ...tab,
      title: newTitle
    } : tab));
  };
  const updatePersonalization = (field: 'name' | 'role' | 'company', value: string) => {
    setPersonalization(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const value = {
    chatTabs,
    activeTabId,
    isLoading,
    addUserMessage,
    addAIResponse,
    updateMessage,
    voteOnMessage,
    acceptMessage,
    addFeedback,
    clearMessages,
    currentQuery,
    setCurrentQuery,
    selectedCategory,
    setSelectedCategory,
    personalization,
    updatePersonalization,
    searchKnowledgeBase,
    recentSearchResults,
    createNewTab,
    switchTab,
    closeTab,
    renameTab,
    getActiveMessages,
    selectedOwners,
    toggleOwner,
    selectAllOwners,
    unselectAllOwners,
    activeMode,
    setActiveMode,
    searchQuery,
    setSearchQuery,
    executeSearch,
    searchResults
  };
  return <AIAssistantContext.Provider value={value}>
      {children}
    </AIAssistantContext.Provider>;
};