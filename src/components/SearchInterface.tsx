import React, { useState } from 'react';
import { Search as SearchIcon, FileText, ExternalLink, BookOpen, Filter } from 'lucide-react';
import { useAIAssistant } from '../context/AIAssistantContext';
import { KnowledgePanel } from './KnowledgePanel';
export function SearchInterface() {
  const {
    searchQuery,
    setSearchQuery,
    executeSearch,
    isLoading,
    searchResults,
    addUserMessage,
    personalization
  } = useAIAssistant();
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      executeSearch(searchQuery);
    }
  };
  const handleAskAbout = (title: string) => {
    addUserMessage(`Tell me about ${title}`);
  };
  const toggleResult = (id: string) => {
    setExpandedResult(expandedResult === id ? null : id);
  };
  return <div className="flex flex-col md:flex-row h-full gap-4">
      <div className="flex-1 flex flex-col">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Search Knowledge Base
        </h2>
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search for documents, guides, or ask a question..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            <SearchIcon size={20} className="absolute left-3 top-3.5 text-gray-400" />
            <button type="submit" className="absolute right-3 top-2.5 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">
              Search
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Try: "How do I reset my password?" or "What are the compliance
            requirements?"
          </p>
        </form>
        {isLoading ? <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Searching knowledge base...
            </span>
          </div> : searchResults ? <div className="flex-1 overflow-y-auto">
            <div className="mb-4">
              <h3 className="font-medium text-gray-700">
                {searchResults.articles.length} results for "{searchQuery}"
              </h3>
              <p className="text-sm text-gray-500">
                Showing most relevant results from {personalization.company}'s
                knowledge base
              </p>
            </div>
            {searchResults.articles.length > 0 ? <div className="space-y-4">
                {searchResults.articles.map((article, index) => <div key={article.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <div className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => toggleResult(article.id)}>
                      <div className="flex items-start">
                        <FileText size={18} className="mt-0.5 mr-3 text-blue-600 flex-shrink-0" />
                        <div>
                          <h4 className="text-lg font-medium text-gray-800 mb-1">
                            {article.title}
                          </h4>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <span>{article.category}</span>
                            <span className="mx-2">•</span>
                            <span>Updated {article.lastUpdated}</span>
                            {article.owner && <>
                                <span className="mx-2">•</span>
                                <span>Owner: {article.owner}</span>
                              </>}
                          </div>
                          <p className="text-gray-700">
                            {article.content.substring(0, 200)}...
                          </p>
                        </div>
                      </div>
                    </div>
                    {expandedResult === article.id && <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <p className="text-gray-700 mb-4 whitespace-pre-line">
                          {article.content}
                        </p>
                        <div className="flex justify-between items-center">
                          <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800">
                            View full document{' '}
                            <ExternalLink size={14} className="ml-1" />
                          </a>
                          <button onClick={e => {
                  e.stopPropagation();
                  handleAskAbout(article.title);
                }} className="flex items-center bg-blue-100 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-200">
                            <BookOpen size={14} className="mr-1.5" />
                            Ask AI about this
                          </button>
                        </div>
                      </div>}
                  </div>)}
              </div> : <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <SearchIcon size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any documents matching your search.
                </p>
                <p className="text-gray-500 text-sm">
                  Try adjusting your search terms or browse the categories in
                  the sidebar.
                </p>
              </div>}
          </div> : <div className="flex-1 flex flex-col items-center justify-center text-center">
            <SearchIcon size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Search the company knowledge base
            </h3>
            <p className="text-gray-600 max-w-md mb-6">
              Find information across all company documents, guides, and
              resources using natural language.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg">
              <button onClick={() => setSearchQuery('How do I reset my password?')} className="p-3 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors">
                How do I reset my password?
              </button>
              <button onClick={() => setSearchQuery('What are our security requirements?')} className="p-3 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors">
                What are our security requirements?
              </button>
              <button onClick={() => setSearchQuery('QuickBooks integration setup')} className="p-3 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors">
                QuickBooks integration setup
              </button>
              <button onClick={() => setSearchQuery('Compliance requirements for new accounts')} className="p-3 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors">
                Compliance requirements for new accounts
              </button>
            </div>
          </div>}
      </div>
      <div className="w-full md:w-72 lg:w-80 shrink-0">
        <KnowledgePanel />
      </div>
    </div>;
}