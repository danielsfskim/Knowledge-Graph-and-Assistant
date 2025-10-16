import React, { useState } from 'react';
import { Copy, Check, Edit2, Save, X, ChevronDown, ChevronUp, FileText, AlertCircle, Shield, Clock, User, ExternalLink, DownloadIcon, BookOpen, FileIcon, LockIcon, ThumbsUp, ThumbsDown, MessageSquare, CheckCircle, MessageCircle, Mail, Video, FileTextIcon, Database, RefreshCw } from 'lucide-react';
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
    acceptMessage,
    addAIResponse
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
  const handleRegenerateResponse = () => {
    // Increase compliance score by 5-10% with each regeneration, max 99%
    const newScore = Math.min(99, complianceScore + Math.floor(Math.random() * 6) + 5);
    // Create improved content for the new response
    const improvedContent = `${content}\n\n[This is an improved response with higher accuracy and compliance]`;
    // Create the same sources but with higher relevance
    const improvedSources = sources.map(source => ({
      ...source,
      relevance: Math.min(0.99, source.relevance + 0.1)
    }));
    // Add a new AI response instead of updating the current one
    addAIResponse(improvedContent, newScore, improvedSources);
  };
  const handleSave = () => {
    // We need to update this to not automatically accept the message
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
  const complianceSources = sources.filter(source => isComplianceSource(source.title)).slice(0, 2); // Limit compliance sources to 2 as requested
  const regularSources = sources.filter(source => !isComplianceSource(source.title));
  // Assign a platform to each compliance source
  const assignSourcePlatform = (index: number, title: string) => {
    const platforms = [{
      name: 'Zendesk',
      icon: <FileTextIcon size={14} className="text-red-500" />,
      color: 'border-red-200 bg-red-50',
      textColor: 'text-red-800',
      badgeColor: 'bg-red-600',
      platformId: 'ZD-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      date: '3 days ago',
      author: 'Compliance Team',
      type: 'Ticket'
    }, {
      name: 'Confluence Wiki',
      icon: <Database size={14} className="text-blue-500" />,
      color: 'border-blue-200 bg-blue-50',
      textColor: 'text-blue-800',
      badgeColor: 'bg-blue-600',
      platformId: 'WIKI-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      date: '2 weeks ago',
      author: 'Legal Department',
      type: 'Article'
    }, {
      name: 'Gmail',
      icon: <Mail size={14} className="text-yellow-600" />,
      color: 'border-yellow-200 bg-yellow-50',
      textColor: 'text-yellow-800',
      badgeColor: 'bg-yellow-600',
      platformId: 'MAIL-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      date: '5 days ago',
      author: 'Compliance Officer',
      type: 'Email Thread'
    }, {
      name: 'Google Drive',
      icon: <FileIcon size={14} className="text-green-500" />,
      color: 'border-green-200 bg-green-50',
      textColor: 'text-green-800',
      badgeColor: 'bg-green-600',
      platformId: 'GD-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      date: 'Last week',
      author: 'Risk Management',
      type: 'Document'
    }, {
      name: 'Slack',
      icon: <MessageCircle size={14} className="text-purple-500" />,
      color: 'border-purple-200 bg-purple-50',
      textColor: 'text-purple-800',
      badgeColor: 'bg-purple-600',
      platformId: 'SL-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      date: 'Yesterday',
      author: 'Compliance Channel',
      type: 'Thread'
    }, {
      name: 'Zoom',
      icon: <Video size={14} className="text-indigo-500" />,
      color: 'border-indigo-200 bg-indigo-50',
      textColor: 'text-indigo-800',
      badgeColor: 'bg-indigo-600',
      platformId: 'ZM-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      date: '2 days ago',
      author: 'Compliance Training',
      type: 'Recording'
    }];
    // Deterministically choose a platform based on the title and index
    const titleSum = title.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const platformIndex = (titleSum + index) % platforms.length;
    return platforms[platformIndex];
  };
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
      <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-lg mr-2 sm:mr-3 mt-1 flex-shrink-0">
        G
      </div>
      <div className="space-y-3 w-full max-w-3xl flex-1">
        <div className={`p-3 sm:p-4 bg-white rounded-lg shadow-sm border ${accepted ? 'border-green-200 bg-green-50' : 'border-gray-100'}`}>
          {/* Top header with compliance score and regenerate button */}
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-gray-100">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full ${getComplianceColor()} mr-2`}></div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">
                {complianceScore}% compliant
              </span>
            </div>
            {!isEditing && <button onClick={handleRegenerateResponse} className="flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium touch-manipulation" title="Generate an improved response">
                <RefreshCw size={14} className="mr-1" /> Regenerate
              </button>}
          </div>
          {!isEditing ? <div className="text-gray-800 whitespace-pre-wrap text-sm sm:text-base">
              {content}
            </div> : <div className="relative">
              <div className="absolute top-0 left-0 right-0 bg-blue-100 text-blue-800 px-3 py-1.5 text-xs font-medium rounded-t-md border-t border-l border-r border-blue-300">
                Editing Response
              </div>
              <textarea value={editedContent} onChange={e => setEditedContent(e.target.value)} className="w-full p-3 pt-10 border-2 border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[125px] text-sm sm:text-base bg-blue-50" autoFocus />
            </div>}
          {/* Feedback input area */}
          {showFeedbackInput && <div className="mt-3 border-t border-gray-100 pt-3">
              <div className="mb-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  Please share your feedback about this response:
                </label>
                <textarea value={feedbackText} onChange={e => setFeedbackText(e.target.value)} placeholder="What was helpful or unhelpful about this response?" className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs sm:text-sm min-h-[80px]" />
              </div>
              <div className="flex space-x-2 justify-end">
                <button onClick={() => setShowFeedbackInput(false)} className="px-2 py-1.5 border border-gray-300 rounded-md text-xs sm:text-sm text-gray-700 hover:bg-gray-50 touch-manipulation">
                  Cancel
                </button>
                <button onClick={handleSubmitFeedback} className="px-2 py-1.5 bg-blue-600 rounded-md text-xs sm:text-sm text-white hover:bg-blue-700 touch-manipulation">
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
                  <p className="text-xs sm:text-sm text-gray-700">{feedback}</p>
                </div>
              </div>
            </div>}
          {/* Accepted status indicator */}
          {accepted && <div className="mt-3 p-2 bg-green-50 border border-green-100 rounded-md flex items-center">
              <CheckCircle size={16} className="text-green-600 mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-green-700">
                Response accepted
              </span>
            </div>}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <div className="flex items-center space-x-2">
              {sources.length > 0 && <button onClick={() => setShowSources(!showSources)} className="flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-800 touch-manipulation">
                  <FileText size={14} className="mr-1" />
                  Sources
                  {showSources ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
                </button>}
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {/* Accept button */}
              <button onClick={handleAccept} className={`p-1.5 rounded-md flex items-center ${accepted ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'} touch-manipulation`} title={accepted ? 'Response accepted' : 'Accept this response'} aria-label={accepted ? 'Response accepted' : 'Accept response'}>
                <CheckCircle size={16} />
                {!accepted && <span className="ml-1 text-xs hidden sm:inline">Accept</span>}
              </button>
              {/* Voting buttons */}
              <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                <button onClick={() => handleVote('upvote')} className={`p-1.5 ${vote === 'upvote' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'} touch-manipulation`} title="This was helpful" aria-label="Upvote">
                  <ThumbsUp size={16} />
                </button>
                <div className="h-5 border-r border-gray-200"></div>
                <button onClick={() => handleVote('downvote')} className={`p-1.5 ${vote === 'downvote' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:bg-gray-100'} touch-manipulation`} title="This was not helpful" aria-label="Downvote">
                  <ThumbsDown size={16} />
                </button>
              </div>
              {!isEditing ? <>
                  {/* Edit button - moved before feedback button */}
                  <button onClick={() => setIsEditing(true)} className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 touch-manipulation" title="Edit response" aria-label="Edit response">
                    <Edit2 size={16} />
                  </button>
                  {/* Feedback button */}
                  {!showFeedbackInput && <button onClick={() => setShowFeedbackInput(true)} className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 touch-manipulation" title="Provide detailed feedback" aria-label="Provide feedback">
                      <MessageSquare size={16} />
                    </button>}
                  <button onClick={handleCopy} className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 touch-manipulation" title="Copy to clipboard" aria-label="Copy to clipboard">
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </> : <>
                  <button onClick={handleSave} className="p-1.5 text-green-600 hover:text-green-700 rounded-md hover:bg-green-50 flex items-center touch-manipulation" title="Save changes" aria-label="Save changes">
                    <Save size={16} />
                    <span className="ml-1 text-xs hidden sm:inline">Save</span>
                  </button>
                  <button onClick={handleCancel} className="p-1.5 text-red-600 hover:text-red-700 rounded-md hover:bg-red-50 touch-manipulation" title="Cancel editing" aria-label="Cancel editing">
                    <X size={16} />
                  </button>
                </>}
            </div>
          </div>
        </div>
        {showSources && <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
            {/* Audit trail header */}
            <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
              <h4 className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                <FileText size={16} className="mr-2" />
                Source Documentation
              </h4>
              <div className="text-xs text-gray-500 flex items-center">
                <Clock size={12} className="mr-1" />
                <span className="hidden sm:inline">Accessed:</span>{' '}
                {formatTimestamp()}
              </div>
            </div>
            {/* Compliance Sources (with special styling) */}
            {complianceSources.length > 0 && <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Shield size={14} className="text-blue-600 mr-1.5" />
                  <h5 className="text-xs sm:text-sm font-medium text-blue-800">
                    Compliance & Security Sources
                  </h5>
                </div>
                <div className="space-y-3">
                  {complianceSources.map((source, index) => {
              const platform = assignSourcePlatform(index, source.title);
              return <div key={`compliance-${index}`} className={`border rounded-md overflow-hidden ${platform.color}`}>
                        <div className="p-2 sm:p-3 cursor-pointer hover:bg-opacity-70 transition-colors" onClick={() => toggleDocumentPreview(`compliance-${index}`)}>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-2 sm:mr-3">
                              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border ${platform.textColor} border-current flex items-center justify-center`}>
                                {platform.icon}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h6 className={`text-xs sm:text-sm font-medium ${platform.textColor} flex flex-wrap items-center`}>
                                    {source.title}
                                    <span className={`ml-1 sm:ml-2 mt-1 sm:mt-0 px-1.5 py-0.5 text-[10px] sm:text-xs ${platform.badgeColor} text-white rounded`}>
                                      {platform.name}
                                    </span>
                                  </h6>
                                  <div className={`text-[10px] sm:text-xs ${platform.textColor} opacity-80 mt-1`}>
                                    {platform.type} • {platform.platformId} •
                                    Last updated: {platform.date} • By:{' '}
                                    {platform.author}
                                  </div>
                                </div>
                                <div>
                                  {activeDocumentId === `compliance-${index}` ? <ChevronUp size={16} className={platform.textColor} /> : <ChevronDown size={16} className={platform.textColor} />}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {activeDocumentId === `compliance-${index}` && <div className="border-t border-current border-opacity-20 p-3 bg-white">
                            <div className={`mb-3 p-2 sm:p-3 ${platform.color} border border-current border-opacity-20 rounded text-xs sm:text-sm ${platform.textColor}`}>
                              <div className="font-medium mb-1">
                                {platform.name} {platform.type} Preview
                              </div>
                              <p className={`${platform.textColor} opacity-80 text-[10px] sm:text-xs`}>
                                This is a preview of the compliance document
                                from {platform.name} that was referenced in
                                generating this response. The full document
                                contains additional details and regulatory
                                information.
                              </p>
                            </div>
                            {/* Platform-specific content previews */}
                            {platform.name === 'Zendesk' && <div className="bg-white border border-gray-200 rounded-md p-2 sm:p-3 mb-3">
                                <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                                  <div className="font-medium text-gray-800 text-xs sm:text-sm flex items-center">
                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] mr-2">
                                      TICKET #{platform.platformId}
                                    </span>
                                    {source.title}
                                  </div>
                                  <div className="text-[10px] sm:text-xs text-gray-500">
                                    Status:{' '}
                                    <span className="text-green-600 font-medium">
                                      Resolved
                                    </span>
                                  </div>
                                </div>
                                <div className="text-[10px] sm:text-xs text-gray-700 mb-2">
                                  <p className="mb-2 font-medium">
                                    Ticket Description:
                                  </p>
                                  <p>
                                    This ticket addresses key compliance
                                    requirements for{' '}
                                    {source.title.toLowerCase()}. All team
                                    members should review these guidelines to
                                    ensure proper adherence to regulatory
                                    standards.
                                  </p>
                                  <div className="mt-3 p-2 bg-gray-50 border border-gray-100 rounded">
                                    <p className="font-medium mb-1">
                                      Support Agent Notes:
                                    </p>
                                    <p>
                                      Updated documentation with the latest
                                      regulatory requirements. The compliance
                                      team has approved these changes and they
                                      are now part of our standard operating
                                      procedures.
                                    </p>
                                  </div>
                                </div>
                              </div>}
                            {platform.name === 'Confluence Wiki' && <div className="bg-white border border-gray-200 rounded-md p-2 sm:p-3 mb-3">
                                <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                                  <div className="font-medium text-gray-800 text-xs sm:text-sm flex items-center">
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] mr-2">
                                      WIKI
                                    </span>
                                    {source.title}
                                  </div>
                                  <div className="text-[10px] sm:text-xs text-gray-500">
                                    Version 2.4 • Last edited {platform.date}
                                  </div>
                                </div>
                                <div className="text-[10px] sm:text-xs text-gray-700 mb-2">
                                  <p className="mb-2">
                                    <span className="font-medium">
                                      Purpose:
                                    </span>{' '}
                                    This document outlines the compliance
                                    requirements and procedures for{' '}
                                    {source.title.toLowerCase()}.
                                  </p>
                                  <p className="mb-2">
                                    <span className="font-medium">Scope:</span>{' '}
                                    These guidelines apply to all employees and
                                    contractors handling customer data and
                                    transactions.
                                  </p>
                                  <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded">
                                    <p className="font-medium text-blue-800 mb-1">
                                      Note:
                                    </p>
                                    <p className="text-blue-700">
                                      The Legal team has reviewed and approved
                                      this documentation as of{' '}
                                      {new Date().toLocaleDateString()}. All
                                      team members are required to complete
                                      training on these procedures.
                                    </p>
                                  </div>
                                </div>
                              </div>}
                            {platform.name === 'Gmail' && <div className="bg-white border border-gray-200 rounded-md p-2 sm:p-3 mb-3">
                                <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                                  <div className="font-medium text-gray-800 text-xs sm:text-sm">
                                    <div>
                                      Subject: {source.title} - Important Update
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-1">
                                      From: compliance@novo.co • To:
                                      all-staff@novo.co
                                    </div>
                                  </div>
                                  <div className="text-[10px] sm:text-xs text-gray-500">
                                    {platform.date} at 10:23 AM
                                  </div>
                                </div>
                                <div className="text-[10px] sm:text-xs text-gray-700 mb-2">
                                  <p className="mb-2">Team,</p>
                                  <p className="mb-2">
                                    I'm writing to share an important update
                                    regarding our {source.title.toLowerCase()}{' '}
                                    procedures. Following the recent regulatory
                                    changes, we've updated our compliance
                                    documentation.
                                  </p>
                                  <p className="mb-2">
                                    The key changes include:
                                    <ul className="list-disc pl-4 mt-1 space-y-1">
                                      <li>Updated verification requirements</li>
                                      <li>
                                        New documentation retention policies
                                      </li>
                                      <li>Revised reporting procedures</li>
                                    </ul>
                                  </p>
                                  <p className="mt-2">
                                    Please review the attached document and
                                    complete the acknowledgment form by Friday.
                                  </p>
                                  <p className="mt-2">
                                    Best regards,
                                    <br />
                                    Compliance Team
                                  </p>
                                </div>
                              </div>}
                            {platform.name === 'Google Drive' && <div className="bg-white border border-gray-200 rounded-md p-2 sm:p-3 mb-3">
                                <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                                  <div className="font-medium text-gray-800 text-xs sm:text-sm flex items-center">
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] mr-2">
                                      DOCUMENT
                                    </span>
                                    {source.title}.docx
                                  </div>
                                  <div className="text-[10px] sm:text-xs text-gray-500">
                                    <span className="text-green-600">●</span>{' '}
                                    Shared with Compliance Team
                                  </div>
                                </div>
                                <div className="text-[10px] sm:text-xs text-gray-700 mb-2">
                                  <div className="p-2 bg-gray-50 border border-gray-100 rounded mb-2">
                                    <p className="font-medium mb-1">
                                      Document Outline:
                                    </p>
                                    <ol className="list-decimal pl-4 space-y-1">
                                      <li>Executive Summary</li>
                                      <li>Regulatory Framework</li>
                                      <li>Implementation Guidelines</li>
                                      <li>Reporting Requirements</li>
                                      <li>Staff Training Procedures</li>
                                      <li>Appendices</li>
                                    </ol>
                                  </div>
                                  <p className="italic">
                                    This document contains confidential
                                    information regarding{' '}
                                    {source.title.toLowerCase()} and should only
                                    be shared with authorized personnel. Last
                                    updated by Risk Management Team on{' '}
                                    {new Date().toLocaleDateString()}.
                                  </p>
                                </div>
                              </div>}
                            {platform.name === 'Slack' && <div className="bg-white border border-gray-200 rounded-md p-2 sm:p-3 mb-3">
                                <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                                  <div className="font-medium text-gray-800 text-xs sm:text-sm">
                                    <div className="flex items-center">
                                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] mr-2">
                                        #compliance-team
                                      </span>
                                      Thread: {source.title}
                                    </div>
                                  </div>
                                  <div className="text-[10px] sm:text-xs text-gray-500">
                                    {platform.date}
                                  </div>
                                </div>
                                <div className="text-[10px] sm:text-xs text-gray-700 mb-2">
                                  <div className="space-y-2">
                                    <div className="flex items-start">
                                      <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-medium mr-2 flex-shrink-0">
                                        A
                                      </div>
                                      <div>
                                        <div className="flex items-center">
                                          <span className="font-medium">
                                            Anthony J.
                                          </span>
                                          <span className="text-gray-500 ml-1">
                                            10:34 AM
                                          </span>
                                        </div>
                                        <p>
                                          Team, I've updated our{' '}
                                          {source.title.toLowerCase()}{' '}
                                          documentation with the latest
                                          regulatory requirements. Please review
                                          and provide feedback by EOD.
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-medium mr-2 flex-shrink-0">
                                        S
                                      </div>
                                      <div>
                                        <div className="flex items-center">
                                          <span className="font-medium">
                                            Saadia C.
                                          </span>
                                          <span className="text-gray-500 ml-1">
                                            11:02 AM
                                          </span>
                                        </div>
                                        <p>
                                          Reviewed the changes. The new
                                          verification process looks good, but
                                          we should clarify the reporting
                                          frequency in section 3.
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-800 font-medium mr-2 flex-shrink-0">
                                        R
                                      </div>
                                      <div>
                                        <div className="flex items-center">
                                          <span className="font-medium">
                                            Rohini P.
                                          </span>
                                          <span className="text-gray-500 ml-1">
                                            11:15 AM
                                          </span>
                                        </div>
                                        <p>
                                          Agreed. I'll update section 3 and
                                          share the final version this
                                          afternoon. @Anthony should we schedule
                                          a training session for the team?
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>}
                            {platform.name === 'Zoom' && <div className="bg-white border border-gray-200 rounded-md p-2 sm:p-3 mb-3">
                                <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                                  <div className="font-medium text-gray-800 text-xs sm:text-sm">
                                    <div className="flex items-center">
                                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] mr-2">
                                        RECORDING
                                      </span>
                                      {source.title} Training Session
                                    </div>
                                  </div>
                                  <div className="text-[10px] sm:text-xs text-gray-500">
                                    Duration: 47:23 • Recorded {platform.date}
                                  </div>
                                </div>
                                <div className="text-[10px] sm:text-xs text-gray-700 mb-2">
                                  <p className="mb-2 font-medium">
                                    Meeting Summary:
                                  </p>
                                  <p className="mb-2">
                                    This recorded training session covers the
                                    updated compliance requirements for{' '}
                                    {source.title.toLowerCase()}. The Compliance
                                    Team walks through the new procedures and
                                    addresses questions from team members.
                                  </p>
                                  <div className="mt-2 p-2 bg-gray-50 border border-gray-100 rounded">
                                    <p className="font-medium mb-1">
                                      Key Timestamps:
                                    </p>
                                    <ul className="space-y-1">
                                      <li>
                                        <span className="text-indigo-600 font-medium">
                                          0:00
                                        </span>{' '}
                                        - Introduction and regulatory background
                                      </li>
                                      <li>
                                        <span className="text-indigo-600 font-medium">
                                          12:34
                                        </span>{' '}
                                        - New verification requirements
                                      </li>
                                      <li>
                                        <span className="text-indigo-600 font-medium">
                                          24:15
                                        </span>{' '}
                                        - Reporting procedures
                                      </li>
                                      <li>
                                        <span className="text-indigo-600 font-medium">
                                          35:22
                                        </span>{' '}
                                        - Q&A session
                                      </li>
                                    </ul>
                                  </div>
                                  <p className="mt-3 italic">
                                    Attendance: 27 team members • Required for
                                    all compliance staff
                                  </p>
                                </div>
                              </div>}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                              <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[10px] sm:text-xs flex items-center text-blue-600 hover:text-blue-800">
                                View full document{' '}
                                <ExternalLink size={10} className="ml-1" />
                              </a>
                              <div className="flex space-x-2">
                                <button className="text-[10px] sm:text-xs flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 touch-manipulation">
                                  <DownloadIcon size={10} className="mr-1" />
                                  Download
                                </button>
                                <button className="text-[10px] sm:text-xs flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 touch-manipulation">
                                  <BookOpen size={10} className="mr-1" />
                                  Cite
                                </button>
                              </div>
                            </div>
                            {/* Audit trail information */}
                            <div className="mt-3 pt-2 border-t border-gray-200 text-[10px] sm:text-xs text-gray-500">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                                <div className="flex items-center">
                                  <User size={10} className="mr-1" />
                                  <span>Accessed by: Support Agent</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock size={10} className="mr-1" />
                                  <span>{formatTimestamp()}</span>
                                </div>
                              </div>
                            </div>
                          </div>}
                      </div>;
            })}
                </div>
              </div>}
            {/* Regular Sources */}
            {regularSources.length > 0 && <div>
                <h5 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FileIcon size={14} className="mr-1.5" />
                  Additional Sources
                </h5>
                <div className="space-y-2">
                  {regularSources.map((source, index) => <div key={`regular-${index}`} className="flex items-start border border-gray-200 rounded-md p-2 bg-white">
                      <div className={`w-1 h-full rounded-full ${source.relevance > 0.9 ? 'bg-green-500' : source.relevance > 0.7 ? 'bg-yellow-500' : 'bg-gray-400'} mr-2 mt-1`}></div>
                      <div>
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-blue-600 hover:underline font-medium">
                          {source.title}
                        </a>
                        <div className="text-[10px] sm:text-xs text-gray-500">
                          Relevance: {Math.round(source.relevance * 100)}%
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>}
          </div>}
        {complianceScore < 70 && <div className="flex items-center bg-red-50 text-red-800 p-2 sm:p-3 rounded-md text-xs sm:text-sm">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            <span>
              This response has a low compliance score. Some information may not
              be accurate or up to date.
            </span>
          </div>}
      </div>
    </div>;
}