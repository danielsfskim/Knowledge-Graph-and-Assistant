import { KnowledgeArticle } from './mockData';
// Simple tokenization function to break text into words
function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^\w\s]/g, '') // Remove punctuation
  .split(/\s+/) // Split by whitespace
  .filter(word => word.length > 2); // Filter out very short words
}
// Calculate term frequency in a document
function calculateTermFrequency(tokens: string[], document: string[]): Record<string, number> {
  const termFrequency: Record<string, number> = {};
  tokens.forEach(token => {
    termFrequency[token] = document.filter(word => word === token).length;
  });
  return termFrequency;
}
// Calculate cosine similarity between query and document
function calculateCosineSimilarity(queryVector: Record<string, number>, documentVector: Record<string, number>): number {
  let dotProduct = 0;
  let queryMagnitude = 0;
  let documentMagnitude = 0;
  // Calculate dot product
  Object.keys(queryVector).forEach(term => {
    if (documentVector[term]) {
      dotProduct += queryVector[term] * documentVector[term];
    }
  });
  // Calculate magnitudes
  queryMagnitude = Math.sqrt(Object.values(queryVector).reduce((sum, val) => sum + val * val, 0));
  documentMagnitude = Math.sqrt(Object.values(documentVector).reduce((sum, val) => sum + val * val, 0));
  // Avoid division by zero
  if (queryMagnitude === 0 || documentMagnitude === 0) {
    return 0;
  }
  return dotProduct / (queryMagnitude * documentMagnitude);
}
// Extract key phrases from text (simple implementation)
function extractKeyPhrases(text: string): string[] {
  const tokens = tokenize(text);
  // Count word frequency
  const wordFrequency: Record<string, number> = {};
  tokens.forEach(token => {
    wordFrequency[token] = (wordFrequency[token] || 0) + 1;
  });
  // Sort by frequency and get top words
  return Object.entries(wordFrequency).sort((a, b) => b[1] - a[1]).slice(0, 5).map(entry => entry[0]);
}
// Intent classification (simple keyword-based approach)
export function classifyIntent(query: string): string {
  const lowercaseQuery = query.toLowerCase();
  // Define intent patterns
  const intentPatterns: Record<string, string[]> = {
    password_reset: ['reset', 'password', 'forgot', 'login', 'cannot access'],
    account_update: ['update', 'change', 'profile', 'information', 'details', 'edit'],
    integration: ['connect', 'integration', 'quickbooks', 'stripe', 'shopify', 'integrate'],
    security: ['security', 'secure', 'protection', 'two-factor', '2fa', 'authentication'],
    billing: ['bill', 'invoice', 'payment', 'charge', 'subscription', 'plan', 'pricing'],
    troubleshooting: ['error', 'issue', 'problem', 'not working', 'help', 'fix', 'trouble'],
    compliance: ['compliance', 'regulation', 'regulatory', 'kyc', 'aml', 'know your customer', 'anti-money', 'laundering', 'ofac', 'sanction', 'privacy', 'gdpr', 'ccpa', 'beneficial owner', 'transaction monitoring', 'suspicious activity', 'report', 'bsa', 'bank secrecy', 'verification', 'identity']
  };
  // Score each intent
  const intentScores: Record<string, number> = {};
  Object.entries(intentPatterns).forEach(([intent, patterns]) => {
    intentScores[intent] = patterns.reduce((score, pattern) => {
      return score + (lowercaseQuery.includes(pattern) ? 1 : 0);
    }, 0);
  });
  // Find the intent with the highest score
  const highestIntent = Object.entries(intentScores).sort((a, b) => b[1] - a[1])[0];
  // Return the highest intent if it has at least one match, otherwise 'general'
  return highestIntent[1] > 0 ? highestIntent[0] : 'general';
}
// Main semantic search function
export function semanticSearch(query: string, knowledgeBase: KnowledgeArticle[], topN: number = 3): {
  articles: KnowledgeArticle[];
  scores: number[];
  intent: string;
} {
  // If the knowledge base is empty due to filters, return empty results
  if (knowledgeBase.length === 0) {
    return {
      articles: [],
      scores: [],
      intent: classifyIntent(query)
    };
  }
  const queryTokens = tokenize(query);
  const queryVector = calculateTermFrequency(queryTokens, queryTokens);
  const intent = classifyIntent(query);
  // Calculate similarity for each article
  const similarities = knowledgeBase.map(article => {
    // Combine title and content for better matching
    const articleText = `${article.title} ${article.content}`;
    const articleTokens = tokenize(articleText);
    const articleVector = calculateTermFrequency(queryTokens, articleTokens);
    // Calculate similarity score
    const similarityScore = calculateCosineSimilarity(queryVector, articleVector);
    // Boost score if article category matches the intent
    const intentBoost = intent === 'password_reset' && article.category === 'Account Management' || intent === 'account_update' && article.category === 'Account Management' || intent === 'integration' && article.category === 'Integrations' || intent === 'security' && article.category === 'Security' || intent === 'billing' && article.category === 'Billing' || intent === 'troubleshooting' && article.category === 'Troubleshooting';
    return intentBoost ? similarityScore * 1.5 : similarityScore;
  });
  // Sort articles by similarity and get top N
  const indexedSimilarities = similarities.map((score, index) => ({
    index,
    score
  }));
  const topArticleIndices = indexedSimilarities.sort((a, b) => b.score - a.score).slice(0, topN).map(item => item.index);
  const topScores = topArticleIndices.map(index => similarities[index]);
  const topArticles = topArticleIndices.map(index => knowledgeBase[index]);
  return {
    articles: topArticles,
    scores: topScores,
    intent
  };
}
// Generate an AI response based on search results
export function generateResponse(query: string, searchResults: {
  articles: KnowledgeArticle[];
  scores: number[];
  intent: string;
}): {
  content: string;
  complianceScore: number;
  sources: {
    title: string;
    url: string;
    relevance: number;
  }[];
} {
  const {
    articles,
    scores,
    intent
  } = searchResults;
  // If no relevant articles found
  if (articles.length === 0 || scores[0] < 0.1) {
    return {
      content: "I'm sorry, I couldn't find specific information about that in Novo's knowledge base. Would you mind rephrasing your question or asking something more specific about Novo's platform? I'm here to help you find what you need.",
      complianceScore: 50,
      sources: []
    };
  }
  // Generate response based on the most relevant article
  const topArticle = articles[0];
  const topScore = scores[0];
  // Calculate compliance score based on search relevance
  const complianceScore = Math.min(95, Math.round(topScore * 100) + 50);
  // Generate sources from search results
  const sources = articles.map((article, index) => ({
    title: article.title,
    url: article.url,
    relevance: Math.min(0.99, scores[index])
  }));
  // Generate friendly intro based on intent
  let friendlyIntro = '';
  switch (intent) {
    case 'password_reset':
      friendlyIntro = "I'd be happy to help you with resetting your password! ";
      break;
    case 'account_update':
      friendlyIntro = "I'd love to show you how to update your account information. ";
      break;
    case 'integration':
      friendlyIntro = 'Great question about integrations! ';
      break;
    case 'security':
      friendlyIntro = "Security is definitely important, and I'm glad you asked about this. ";
      break;
    case 'billing':
      friendlyIntro = 'I understand you have a question about billing. ';
      break;
    case 'troubleshooting':
      friendlyIntro = "I'm sorry you're experiencing an issue. Let me help you resolve that. ";
      break;
    case 'compliance':
      friendlyIntro = "Regarding your compliance question, here's the information from our resources. ";
      break;
    default:
      friendlyIntro = 'Thank you for your question! ';
  }
  // Extract and format steps if possible
  const contentWithSteps = formatContentWithSteps(topArticle.content, intent);
  // Add reassuring conclusion based on intent
  let conclusion = '';
  switch (intent) {
    case 'password_reset':
      conclusion = " If you have any trouble with these steps, Novo's support team is always available to help at help@novo.com.";
      break;
    case 'account_update':
      conclusion = ' These changes will take effect immediately, and you can make updates anytime you need to.';
      break;
    case 'integration':
      conclusion = ' Once connected, the integration will save you time and help streamline your workflow.';
      break;
    case 'security':
      conclusion = ' Taking these security measures will help keep your Novo account protected.';
      break;
    case 'billing':
      conclusion = ' Novo aims to keep their pricing transparent and straightforward for all customers.';
      break;
    case 'troubleshooting':
      conclusion = " If this solution doesn't resolve your issue, Novo's support team is ready to help with more personalized assistance.";
      break;
    case 'compliance':
      conclusion = ' For more detailed compliance information, please consult our full compliance documentation or contact our compliance team at compliance@novo.com.';
      break;
    default:
      conclusion = ' I hope this information helps! Let me know if you have any other questions.';
  }
  // Combine all parts into a complete, friendly response
  const responseText = `${friendlyIntro}${contentWithSteps}${conclusion}`;
  return {
    content: responseText,
    complianceScore,
    sources
  };
}
// Helper function to format content with steps when applicable
function formatContentWithSteps(content: string, intent: string): string {
  // Check if the content likely contains steps (contains words like "first", "then", "navigate", "go to", etc.)
  const hasStepIndicators = /first|then|next|finally|follow|steps|click on|navigate|go to/i.test(content);
  if (!hasStepIndicators) {
    return content;
  }
  // Try to identify and format steps
  let formattedContent = content;
  // Replace common step indicators with numbered steps
  formattedContent = formattedContent
  // Split into sentences
  .split('. ').map((sentence, index) => {
    // Check if this sentence looks like a step instruction
    if (/click|navigate|go to|select|enable|choose|enter|follow|open/i.test(sentence)) {
      return `\n\n**Step ${index + 1}**: ${sentence}`;
    }
    return sentence;
  }).join('. ');
  // Clean up formatting for the first step (remove extra newlines at beginning)
  formattedContent = formattedContent.replace(/^\n\n/, '');
  // If we haven't created any steps but we think there should be steps,
  // try a different approach - just add a heading and format nicely
  if (!formattedContent.includes('**Step')) {
    formattedContent = `\n\n**Here's how to do this:**\n\n${content}`;
  }
  return formattedContent;
}