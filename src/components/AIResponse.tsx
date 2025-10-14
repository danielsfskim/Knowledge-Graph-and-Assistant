import React, { useState } from 'react';
import { Copy, Check, Edit2, Save, X, ChevronDown, ChevronUp, FileText, AlertCircle, Shield, Clock, User, ExternalLink, DownloadIcon, BookOpen, FileIcon, LockIcon, ThumbsUp, ThumbsDown, MessageSquare, CheckCircle } from 'lucide-react';
import { Source, VoteType, useAIAssistant } from '../context/AIAssistantContext';
interface AIResponseProps {
  id: string;
  content: string;
  complianceScore: number;
  sources: Source[];
  vote?: VoteType;
  feedback?: string;
  accepted?: boolean;
}
export function AIResponse({
  id,
  content,
  complianceScore,
  sources,
  vote,
  feedback,
  accepted
}: AIResponseProps) {
  const {
    updateMessage,
    voteOnMessage,
    addFeedback,
    acceptMessage
  } = useAIAssistant();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [copied, setCopied] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState(feedback || '');
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleSave = () => {
    updateMessage(id, editedContent);
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };
  const handleAccept = () => {
    acceptMessage(id, !accepted);
  };
  const handleVote = (newVote: VoteType) => {
    voteOnMessage(id, newVote);
  };
  const handleSubmitFeedback = () => {
    if (feedbackText.trim()) {
      addFeedback(id, feedbackText);
      setShowFeedbackInput(false);
    }
  };
  // Calculate compliance color
  const getComplianceColor = () => {
    if (complianceScore >= 90) return 'bg-green-500';
    if (complianceScore >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  // Determine if a source is compliance or security related
  const isComplianceSource = (title: string) => {
    const complianceKeywords = ['compliance', 'regulatory', 'kyc', 'aml', 'ofac', 'sanction', 'privacy', 'gdpr', 'ccpa', 'beneficial owner', 'transaction monitoring', 'security', 'authentication', 'verification'];
    return complianceKeywords.some(keyword => title.toLowerCase().includes(keyword));
  };
  // Group sources by type (compliance vs regular)
  const complianceSources = sources.filter(source => isComplianceSource(source.title));
  const regularSources = sources.filter(source => !isComplianceSource(source.title));
  // Toggle document preview
  const toggleDocumentPreview = (id: string) => {
    setActiveDocumentId(activeDocumentId === id ? null : id);
  };
  // Format timestamp for audit trail
  const formatTimestamp = () => {
    const now = new Date();
    return now.toISOString();
  };
  return <div className="flex items-start">
      <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-lg mr-3 mt-1 flex-shrink-0">
        G
      </div>
      <div className="space-y-3 max-w-3xl flex-1">
        <div className={`p-4 bg-white rounded-lg shadow-sm border ${accepted ? 'border-green-200 bg-green-50' : 'border-gray-100'}`}>
          {!isEditing ? <div className="text-gray-800 whitespace-pre-wrap">{content}</div> : <textarea value={editedContent} onChange={e => setEditedContent(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]" />}
          {/* Feedback input area */}
          {showFeedbackInput && <div className="mt-3 border-t border-gray-100 pt-3">
              <div className="mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Please share your feedback about this response:
                </label>
                <textarea value={feedbackText} onChange={e => setFeedbackText(e.target.value)} placeholder="What was helpful or unhelpful about this response?" className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm min-h-[80px]" />
              </div>
              <div className="flex space-x-2 justify-end">
                <button onClick={() => setShowFeedbackInput(false)} className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSubmitFeedback} className="px-3 py-1.5 bg-blue-600 rounded-md text-sm text-white hover:bg-blue-700">
                  Submit Feedback
                </button>
              </div>
            </div>}
          {/* Display submitted feedback */}
          {feedback && !showFeedbackInput && <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-md">
              <div className="flex items-start">
                <MessageSquare size={16} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-1">
                    Your feedback:
                  </div>
                  <p className="text-sm text-gray-700">{feedback}</p>
                </div>
              </div>
            </div>}
          {/* Accepted status indicator */}
          {accepted && <div className="mt-3 p-2 bg-green-50 border border-green-100 rounded-md flex items-center">
              <CheckCircle size={16} className="text-green-600 mr-2 flex-shrink-0" />
              <span className="text-sm text-green-700">Response accepted</span>
            </div>}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${getComplianceColor()} mr-2`}></div>
                <span className="text-sm text-gray-600">
                  {complianceScore}% compliant
                </span>
              </div>
              {sources.length > 0 && <button onClick={() => setShowSources(!showSources)} className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                  <FileText size={14} className="mr-1" />
                  Sources
                  {showSources ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
                </button>}
            </div>
            <div className="flex space-x-2">
              {/* Accept button */}
              <button onClick={handleAccept} className={`p-1.5 rounded-md flex items-center ${accepted ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`} title={accepted ? 'Response accepted' : 'Accept this response'} aria-label={accepted ? 'Response accepted' : 'Accept response'}>
                <CheckCircle size={16} />
                {!accepted && <span className="ml-1 text-xs">Accept</span>}
              </button>
              {/* Voting buttons */}
              <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                <button onClick={() => handleVote('upvote')} className={`p-1.5 ${vote === 'upvote' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`} title="This was helpful" aria-label="Upvote">
                  <ThumbsUp size={16} />
                </button>
                <div className="h-5 border-r border-gray-200"></div>
                <button onClick={() => handleVote('downvote')} className={`p-1.5 ${vote === 'downvote' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:bg-gray-100'}`} title="This was not helpful" aria-label="Downvote">
                  <ThumbsDown size={16} />
                </button>
              </div>
              {/* Feedback button */}
              {!showFeedbackInput && <button onClick={() => setShowFeedbackInput(true)} className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100" title="Provide detailed feedback">
                  <MessageSquare size={16} />
                </button>}
              {!isEditing ? <>
                  <button onClick={() => setIsEditing(true)} className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100" title="Edit response">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={handleCopy} className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100" title="Copy to clipboard">
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </> : <>
                  <button onClick={handleSave} className="p-1.5 text-green-600 hover:text-green-700 rounded-md hover:bg-green-50 flex items-center" title="Save changes">
                    <Save size={16} />
                    <span className="ml-1 text-xs">Save</span>
                  </button>
                  <button onClick={handleCancel} className="p-1.5 text-red-600 hover:text-red-700 rounded-md hover:bg-red-50" title="Cancel editing">
                    <X size={16} />
                  </button>
                </>}
            </div>
          </div>
        </div>
        {showSources && <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
            {/* Audit trail header */}
            <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center">
                <FileText size={16} className="mr-2" />
                Source Documentation
              </h4>
              <div className="text-xs text-gray-500 flex items-center">
                <Clock size={12} className="mr-1" />
                Accessed: {formatTimestamp()}
              </div>
            </div>
            {/* Compliance Sources (with special styling) */}
            {complianceSources.length > 0 && <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Shield size={14} className="text-blue-600 mr-1.5" />
                  <h5 className="text-sm font-medium text-blue-800">
                    Compliance & Security Sources
                  </h5>
                </div>
                <div className="space-y-3">
                  {complianceSources.map((source, index) => <div key={`compliance-${index}`} className="border border-blue-100 rounded-md bg-blue-50 overflow-hidden">
                      <div className="p-3 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => toggleDocumentPreview(`compliance-${index}`)}>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                              <LockIcon size={14} className="text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h6 className="font-medium text-blue-800 flex items-center">
                                  {source.title}
                                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-600 text-white rounded">
                                    Compliance
                                  </span>
                                </h6>
                                <div className="text-xs text-blue-700 mt-1">
                                  Relevance:{' '}
                                  {Math.round(source.relevance * 100)}% • Doc
                                  ID: NOVO-
                                  {Math.random().toString(36).substr(2, 6).toUpperCase()}
                                </div>
                              </div>
                              <div>
                                {activeDocumentId === `compliance-${index}` ? <ChevronUp size={16} className="text-blue-600" /> : <ChevronDown size={16} className="text-blue-600" />}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {activeDocumentId === `compliance-${index}` && <div className="border-t border-blue-200 p-3 bg-white">
                          <div className="mb-3 p-3 bg-blue-50 border border-blue-100 rounded text-sm text-blue-800">
                            <div className="font-medium mb-1">
                              Document Preview
                            </div>
                            <p className="text-blue-700">
                              This is a preview of the compliance document that
                              was referenced in generating this response. The
                              full document contains additional details and
                              regulatory information.
                            </p>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-md p-3 mb-3">
                            <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                              <div className="font-medium text-gray-800">
                                {source.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                Last Updated: {new Date().toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-sm text-gray-700 mb-2">
                              {/* Placeholder content based on the source title */}
                              <p>
                                This document outlines the{' '}
                                {source.title.toLowerCase()} requirements and
                                procedures that must be followed by all
                                employees when handling customer data and
                                transactions. The information contained herein
                                is based on current regulatory guidelines and
                                company policies.
                              </p>
                              <p className="mt-2">
                                Please refer to the full document for complete
                                details on implementation and compliance
                                requirements.
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center text-blue-600 hover:text-blue-800">
                              View full document{' '}
                              <ExternalLink size={12} className="ml-1" />
                            </a>
                            <div className="flex space-x-2">
                              <button className="text-xs flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200">
                                <DownloadIcon size={12} className="mr-1" />
                                Download
                              </button>
                              <button className="text-xs flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                                <BookOpen size={12} className="mr-1" />
                                Cite
                              </button>
                            </div>
                          </div>
                          {/* Audit trail information */}
                          <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <User size={12} className="mr-1" />
                                <span>Accessed by: Support Agent</span>
                              </div>
                              <div className="flex items-center">
                                <Clock size={12} className="mr-1" />
                                <span>{formatTimestamp()}</span>
                              </div>
                            </div>
                          </div>
                        </div>}
                    </div>)}
                </div>
              </div>}
            {/* Regular Sources */}
            {regularSources.length > 0 && <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FileIcon size={14} className="mr-1.5" />
                  Additional Sources
                </h5>
                <div className="space-y-2">
                  {regularSources.map((source, index) => <div key={`regular-${index}`} className="flex items-start border border-gray-200 rounded-md p-2 bg-white">
                      <div className={`w-1 h-full rounded-full ${source.relevance > 0.9 ? 'bg-green-500' : source.relevance > 0.7 ? 'bg-yellow-500' : 'bg-gray-400'} mr-2 mt-1`}></div>
                      <div>
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline font-medium">
                          {source.title}
                        </a>
                        <div className="text-xs text-gray-500">
                          Relevance: {Math.round(source.relevance * 100)}%
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>}
          </div>}
        {complianceScore < 70 && <div className="flex items-center bg-red-50 text-red-800 p-3 rounded-md text-sm">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            <span>
              This response has a low compliance score. Some information may not
              be accurate or up to date.
            </span>
          </div>}
      </div>
    </div>;
}