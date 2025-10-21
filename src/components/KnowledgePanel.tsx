import React, { useEffect, useState } from 'react';
import { Search, FileText, ExternalLink, ChevronDown, ChevronUp, BookOpen, Users, Filter } from 'lucide-react';
import { useAIAssistant } from '../context/AIAssistantContext';
import { mockKnowledgeBase } from '../utils/mockData';
import { OwnerFilter } from './OwnerFilter';
interface KnowledgeArticle {
  title: string;
  url: string;
  excerpt: string;
  category: string;
  lastUpdated: string;
  owner?: string;
}
export function KnowledgePanel() {
  const {
    currentQuery,
    searchKnowledgeBase,
    recentSearchResults,
    addUserMessage,
    selectedOwners
  } = useAIAssistant();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [knowledgeArticles, setKnowledgeArticles] = useState<KnowledgeArticle[]>([]);
  const [highlightedArticles, setHighlightedArticles] = useState<string[]>([]);
  const [showOwnerFilter, setShowOwnerFilter] = useState(false);
  // Add state to track panel expansion
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  const teamMembers = [{
    name: 'Alice',
    color: 'bg-blue-500',
    avatar: 'A',
    team: 'Engineering'
  }, {
    name: 'Bob',
    color: 'bg-green-500',
    avatar: 'B',
    team: 'Product'
  }, {
    name: 'Charlie',
    color: 'bg-yellow-500',
    avatar: 'C',
    team: 'Design'
  }, {
    name: 'Diana',
    color: 'bg-purple-500',
    avatar: 'D',
    team: 'Marketing'
  }, {
    name: 'Eve',
    color: 'bg-red-500',
    avatar: 'E',
    team: 'Sales'
  }];
  // Convert mockKnowledgeBase to the format used in this component
  useEffect(() => {
    // Filter articles by selected owners
    const filteredArticles = selectedOwners.length < teamMembers.length ? mockKnowledgeBase.filter(article => article.owner && selectedOwners.includes(article.owner)) : mockKnowledgeBase;
    const articles = filteredArticles.map(article => ({
      title: article.title,
      url: article.url,
      excerpt: article.content.substring(0, 120) + '...',
      category: article.category,
      lastUpdated: article.lastUpdated,
      owner: article.owner
    }));
    setKnowledgeArticles(articles);
  }, [selectedOwners]);
  // Update highlighted articles when search results change
  useEffect(() => {
    if (recentSearchResults && recentSearchResults.articles) {
      const highlightedTitles = recentSearchResults.articles.map(article => article.title);
      setHighlightedArticles(highlightedTitles);
      // Auto-expand the top result
      if (highlightedTitles.length > 0) {
        setExpandedArticle(highlightedTitles[0]);
      }
    }
  }, [recentSearchResults]);
  // Handle search in the knowledge panel
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = searchKnowledgeBase(searchQuery);
      setSearchQuery('');
    }
  };
  // Handle clicking on an article to ask about it
  const handleAskAbout = (title: string) => {
    addUserMessage(`Tell me about ${title}`);
  };
  // Filter articles based on search query for the panel's internal search
  const filteredArticles = searchQuery.trim() === '' ? knowledgeArticles : knowledgeArticles.filter(article => article.title.toLowerCase().includes(searchQuery.toLowerCase()) || article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) || article.category.toLowerCase().includes(searchQuery.toLowerCase()));
  // Sort articles to show highlighted ones first
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    const aHighlighted = highlightedArticles.includes(a.title);
    const bHighlighted = highlightedArticles.includes(b.title);
    if (aHighlighted && !bHighlighted) return -1;
    if (!aHighlighted && bHighlighted) return 1;
    // If both are highlighted, sort by their position in the highlighted array
    if (aHighlighted && bHighlighted) {
      return highlightedArticles.indexOf(a.title) - highlightedArticles.indexOf(b.title);
    }
    return 0;
  });
  const toggleArticle = (title: string) => {
    if (expandedArticle === title) {
      setExpandedArticle(null);
    } else {
      setExpandedArticle(title);
    }
  };
  return <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full overflow-hidden flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-800 text-sm">Knowledge Base</h3>
          <div className="flex items-center">
            <button onClick={() => setShowOwnerFilter(!showOwnerFilter)} className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 touch-manipulation mr-1" title="Filter by team member" aria-label="Filter by team member">
              <Filter size={16} />
            </button>
            {/* Add expand/collapse button */}
            <button onClick={() => setIsPanelExpanded(!isPanelExpanded)} className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 touch-manipulation" title={isPanelExpanded ? 'Collapse panel' : 'Expand panel'} aria-label={isPanelExpanded ? 'Collapse panel' : 'Expand panel'}>
              {isPanelExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Explore related articles from Novo's help center
        </p>
        <form onSubmit={handleSearch} className="mt-2 relative">
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search articles..." className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs" />
          <Search size={14} className="absolute left-2.5 top-2 text-gray-400" />
          <button type="submit" className="sr-only">
            Search
          </button>
        </form>
        {showOwnerFilter && <OwnerFilter />}
      </div>
      {/* Wrap the content in a div with transition and conditional height */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isPanelExpanded ? 'flex-1' : 'h-0'}`}>
        <div className="flex-1 overflow-y-auto p-3" onWheel={e => {
        // Prevent scroll propagation to parent containers
        e.stopPropagation();
      }} style={{
        overscrollBehavior: 'contain',
        // Always show scrollbar
        overflowY: 'scroll',
        // Firefox scrollbar styling
        scrollbarWidth: 'thin',
        scrollbarColor: '#CBD5E1 #F1F5F9',
        // Custom scrollbar styling for WebKit browsers
        '&::-webkit-scrollbar': {
          width: '8px'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#F1F5F9',
          borderRadius: '4px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#CBD5E1',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#94A3B8'
          }
        }
      }}>
          {currentQuery && recentSearchResults && <div className="mb-3 p-2 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-xs font-medium text-blue-800 mb-1">
                Relevant to your question
              </p>
              <p className="text-[10px] text-blue-700">
                {recentSearchResults.articles.length > 0 ? `Found ${recentSearchResults.articles.length} relevant articles` : 'No directly relevant articles found'}
              </p>
            </div>}
          {knowledgeArticles.length === 0 ? <div className="text-center py-6 text-gray-500 text-xs">
              No articles found. Try selecting different team members.
            </div> : sortedArticles.length === 0 ? <div className="text-center py-6 text-gray-500 text-xs">
              No articles found matching your search
            </div> : <div className="space-y-3">
              {sortedArticles.map(article => {
            const owner = article.owner || 'Unknown';
            const teamMember = teamMembers.find(m => m.name === owner);
            return <div key={article.title} className={`border rounded-md overflow-hidden transition-all ${highlightedArticles.includes(article.title) ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                    <div className={`flex justify-between items-start p-2 cursor-pointer hover:bg-gray-50 ${highlightedArticles.includes(article.title) ? 'hover:bg-blue-100' : ''}`} onClick={() => toggleArticle(article.title)}>
                      <div className="flex items-start">
                        <FileText size={14} className={`mt-0.5 mr-1.5 flex-shrink-0 ${highlightedArticles.includes(article.title) ? 'text-blue-600' : 'text-gray-500'}`} />
                        <div>
                          <h4 className={`text-xs font-medium ${highlightedArticles.includes(article.title) ? 'text-blue-800' : 'text-gray-800'}`}>
                            {article.title}
                          </h4>
                          <div className="flex items-center mt-1">
                            <p className="text-[10px] text-gray-500">
                              {article.category} • Updated {article.lastUpdated}
                            </p>
                            {teamMember && <div className={`ml-1 w-4 h-4 rounded-full ${teamMember.color} flex items-center justify-center text-white text-[10px] font-medium`} title={owner}>
                                {teamMember.avatar}
                              </div>}
                          </div>
                        </div>
                      </div>
                      <div className="ml-1.5 flex-shrink-0">
                        {expandedArticle === article.title ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
                      </div>
                    </div>
                    {expandedArticle === article.title && <div className="p-2 border-t border-gray-200 bg-gray-50">
                        <p className="text-xs text-gray-700 mb-2">
                          {article.excerpt}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                          {article.url && <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-[10px] text-blue-600 hover:text-blue-800">
                              Read full article{' '}
                              <ExternalLink size={10} className="ml-1" />
                            </a>}
                          <button onClick={e => {
                    e.stopPropagation();
                    handleAskAbout(article.title);
                  }} className="text-[10px] flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 touch-manipulation w-full sm:w-auto justify-center sm:justify-start">
                            <BookOpen size={10} className="mr-1" />
                            Ask about this
                          </button>
                        </div>
                      </div>}
                  </div>;
          })}
            </div>}
        </div>
      </div>
      {/* Show a minimal indicator when collapsed */}
      {!isPanelExpanded && <div className="p-2 text-center border-t border-gray-200 text-xs text-gray-500">
          <span className="animate-pulse">Click to expand knowledge base</span>
        </div>}
    </div>;
}