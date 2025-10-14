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
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-800">Knowledge Base</h3>
          <button onClick={() => setShowOwnerFilter(!showOwnerFilter)} className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100" title="Filter by team member">
            <Filter size={16} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Explore related articles from Novo's help center
        </p>
        <form onSubmit={handleSearch} className="mt-3 relative">
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search articles..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm" />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <button type="submit" className="sr-only">
            Search
          </button>
        </form>
        {showOwnerFilter && <OwnerFilter />}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {currentQuery && recentSearchResults && <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
            <p className="text-sm font-medium text-blue-800 mb-1">
              Relevant to your question
            </p>
            <p className="text-xs text-blue-700">
              {recentSearchResults.articles.length > 0 ? `Found ${recentSearchResults.articles.length} relevant articles` : 'No directly relevant articles found'}
            </p>
          </div>}
        {knowledgeArticles.length === 0 ? <div className="text-center py-6 text-gray-500">
            No articles found. Try selecting different team members.
          </div> : sortedArticles.length === 0 ? <div className="text-center py-6 text-gray-500">
            No articles found matching your search
          </div> : <div className="space-y-4">
            {sortedArticles.map(article => {
          const owner = article.owner || 'Unknown';
          const teamMember = teamMembers.find(m => m.name === owner);
          return <div key={article.title} className={`border rounded-md overflow-hidden transition-all ${highlightedArticles.includes(article.title) ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                  <div className={`flex justify-between items-start p-3 cursor-pointer hover:bg-gray-50 ${highlightedArticles.includes(article.title) ? 'hover:bg-blue-100' : ''}`} onClick={() => toggleArticle(article.title)}>
                    <div className="flex items-start">
                      <FileText size={16} className={`mt-0.5 mr-2 flex-shrink-0 ${highlightedArticles.includes(article.title) ? 'text-blue-600' : 'text-gray-500'}`} />
                      <div>
                        <h4 className={`text-sm font-medium ${highlightedArticles.includes(article.title) ? 'text-blue-800' : 'text-gray-800'}`}>
                          {article.title}
                        </h4>
                        <div className="flex items-center mt-1">
                          <p className="text-xs text-gray-500">
                            {article.category} • Updated {article.lastUpdated}
                          </p>
                          {teamMember && <div className={`ml-2 w-5 h-5 rounded-full ${teamMember.color} flex items-center justify-center text-white text-xs font-medium`} title={owner}>
                              {teamMember.avatar}
                            </div>}
                        </div>
                      </div>
                    </div>
                    <div className="ml-2">
                      {expandedArticle === article.title ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                    </div>
                  </div>
                  {expandedArticle === article.title && <div className="p-3 border-t border-gray-200 bg-gray-50">
                      <p className="text-sm text-gray-700 mb-3">
                        {article.excerpt}
                      </p>
                      <div className="flex justify-between items-center">
                        {article.url && <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-blue-600 hover:text-blue-800">
                            Read full article{' '}
                            <ExternalLink size={12} className="ml-1" />
                          </a>}
                        <button onClick={e => {
                  e.stopPropagation();
                  handleAskAbout(article.title);
                }} className="text-xs flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                          <BookOpen size={12} className="mr-1" />
                          Ask about this
                        </button>
                      </div>
                    </div>}
                </div>;
        })}
          </div>}
      </div>
    </div>;
}