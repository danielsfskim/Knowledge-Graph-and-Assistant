// This file contains mock data for the AI assistant
export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  url: string;
  category: string;
  lastUpdated: string;
  owner?: string;
}
// Define team members
export const teamMembers = [{
  id: '1',
  name: 'Rohini P.',
  avatar: 'R',
  color: 'bg-purple-600'
}, {
  id: '2',
  name: 'Saadia C.',
  avatar: 'S',
  color: 'bg-green-600'
}, {
  id: '3',
  name: 'Anthony J.',
  avatar: 'A',
  color: 'bg-orange-600'
}];
export const mockKnowledgeBase: KnowledgeArticle[] = [{
  id: '1',
  title: 'Password Reset Guide',
  content: 'To reset your password, click on the "Forgot Password" link on the login page. You will receive an email with instructions to create a new password. For security reasons, password reset links expire after 24 hours. If you don\'t receive the email, check your spam folder or contact support at help@novo.com.',
  url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407701-Password-Reset-Guide',
  category: 'Account Management',
  lastUpdated: '2023-10-15',
  owner: 'Rohini P.'
}, {
  id: '2',
  title: 'Integration with QuickBooks',
  content: 'Novo offers seamless integration with QuickBooks. To connect your accounts, navigate to Settings > Integrations > QuickBooks and follow the authorization steps. Once connected, your transactions will automatically sync with your QuickBooks account. You can choose which transactions to sync and how often the sync should occur. For best results, we recommend daily syncing.',
  url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407702-Integration-with-QuickBooks',
  category: 'Integrations',
  lastUpdated: '2023-11-22',
  owner: 'Rohini P.'
}, {
  id: '3',
  title: 'Account Security Best Practices',
  content: 'Protect your Novo account by enabling two-factor authentication, using a strong unique password, and regularly monitoring your account for suspicious activity. Never share your login credentials with anyone. We recommend changing your password every 90 days and using a password manager to generate and store strong passwords.',
  url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407703-Account-Security-Best-Practices',
  category: 'Security',
  lastUpdated: '2023-12-05',
  owner: 'Anthony J.'
}, {
  id: '4',
  title: 'User Profile Settings',
  content: 'To update your account information, log in to your Novo dashboard and click on Settings > Profile. From there, you can edit your personal information, business details, and contact preferences. You can also update your profile picture, change notification settings, and manage connected devices from this section.',
  url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407704-User-Profile-Settings',
  category: 'Account Management',
  lastUpdated: '2024-01-18',
  owner: 'Rohini P.'
}, {
  id: '5',
  title: 'Stripe Integration Guide',
  content: 'Connect your Stripe account to Novo for streamlined payment processing. Go to Integrations in your dashboard, select Stripe, and follow the connection workflow. This allows you to manage payments directly through your Novo account. You can process credit card payments, set up recurring billing, and track all transactions in one place.',
  url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407705-Stripe-Integration-Guide',
  category: 'Integrations',
  lastUpdated: '2024-02-03',
  owner: 'Rohini P.'
}, {
  id: '6',
  title: 'Business Debit Card Management',
  content: 'Manage your Novo business debit card through the Cards section of your dashboard. You can activate new cards, freeze lost or stolen cards, set spending limits, and view transaction history. For security reasons, physical cards are shipped to your verified business address only and typically arrive within 5-7 business days.',
  url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407706-Business-Debit-Card-Management',
  category: 'Account Management',
  lastUpdated: '2024-01-10',
  owner: 'Rohini P.'
}, {
  id: '7',
  title: 'Troubleshooting Failed Transfers',
  content: 'If you experience issues with transfers, first verify that you have sufficient funds and that the account details are correct. Common reasons for failed transfers include incorrect routing numbers, insufficient funds, or daily transfer limits. If the issue persists, check for any account restrictions or contact Novo support with the transaction reference number for assistance.',
  url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407707-Troubleshooting-Failed-Transfers',
  category: 'Troubleshooting',
  lastUpdated: '2023-12-22',
  owner: 'Rohini P.'
}, {
  id: '8',
  title: 'Mobile App Features Guide',
  content: 'The Novo mobile app allows you to manage your business banking on the go. Key features include check deposits, transaction monitoring, transfer initiation, and expense categorization. You can also set up push notifications for account activity, view statements, and contact support directly through the app. The app is available for both iOS and Android devices.',
  url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407708-Mobile-App-Features-Guide',
  category: 'Getting Started',
  lastUpdated: '2024-02-15',
  owner: 'Saadia C.'
}, {
  id: '9',
  title: 'Monthly Statement Access',
  content: "Access your monthly statements by navigating to the Statements section in your Novo dashboard. Statements are generated on the first day of each month for the previous month's activity. You can download statements in PDF format for the past 24 months. For older statements, please contact customer support with your account details and the specific months needed.",
  url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407709-Monthly-Statement-Access',
  category: 'Account Management',
  lastUpdated: '2023-11-05',
  owner: 'Rohini P.'
}, {
  id: '10',
  title: 'Billing and Fee Schedule',
  content: 'Novo offers transparent pricing with no hidden fees. There are no monthly maintenance fees, minimum balance requirements, or transaction fees for standard ACH transfers. However, there may be fees for expedited services, wire transfers, or excessive cash deposits. Refer to the complete fee schedule in your account agreement for detailed information on all potential charges.',
  url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407710-Billing-and-Fee-Schedule',
  category: 'Billing',
  lastUpdated: '2024-01-30',
  owner: 'Saadia C.'
}, {
  id: '11',
  title: 'Shopify Integration Setup',
  content: 'Connect your Novo account with Shopify to streamline your e-commerce operations. In your Novo dashboard, go to Integrations, select Shopify, and follow the prompts to authorize the connection. Once connected, your Shopify sales, fees, and payouts will automatically reconcile with your Novo account. This integration helps with bookkeeping accuracy and financial reporting.',
  url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407711-Shopify-Integration-Setup',
  category: 'Integrations',
  lastUpdated: '2023-12-12',
  owner: 'Rohini P.'
}, {
  id: '12',
  title: 'Two-Factor Authentication Setup',
  content: 'Enhance your account security by enabling two-factor authentication (2FA). Go to Settings > Security and select "Enable Two-Factor Authentication." You can choose between SMS verification or an authenticator app like Google Authenticator or Authy. We strongly recommend using an authenticator app as it provides stronger security than SMS verification.',
  url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407712-Two-Factor-Authentication-Setup',
  category: 'Security',
  lastUpdated: '2024-02-08',
  owner: 'Anthony J.'
}, {
  id: '13',
  title: 'KYC Verification Requirements',
  content: 'Know Your Customer (KYC) verification is required for all Novo accounts to comply with federal regulations. During account setup, you must provide a valid government-issued photo ID, proof of business registration (for business accounts), and verification of your physical address. For enhanced verification, we may request additional documentation such as EIN confirmation, articles of incorporation, or business licenses. All documents must be current and unaltered. The verification process typically takes 1-3 business days but may take longer in some cases.',
  url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407713-KYC-Verification-Requirements',
  category: 'Compliance Resources',
  lastUpdated: '2024-01-15',
  owner: 'Anthony J.'
}, {
  id: '14',
  title: 'Anti-Money Laundering (AML) Policy',
  content: 'Novo maintains a comprehensive Anti-Money Laundering (AML) program in compliance with the Bank Secrecy Act and related regulations. Our AML policy includes customer identification procedures, transaction monitoring, suspicious activity reporting, and regular staff training. We conduct ongoing monitoring of accounts for unusual activity patterns and may temporarily freeze accounts if suspicious activity is detected. As part of our compliance obligations, we may request additional information about certain transactions, especially those involving large amounts or international transfers. All Novo customers must comply with these procedures to maintain their accounts in good standing.',
  url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407714-Anti-Money-Laundering-AML-Policy',
  category: 'Compliance Resources',
  lastUpdated: '2024-02-20',
  owner: 'Anthony J.'
}, {
  id: '15',
  title: 'Regulatory Reporting Guidelines',
  content: 'Novo is required to file various regulatory reports to comply with federal banking regulations. These include Currency Transaction Reports (CTRs) for cash transactions over $10,000 and Suspicious Activity Reports (SARs) when appropriate. We are prohibited by law from informing customers when a SAR has been filed. For business accounts, we may also be required to collect beneficial ownership information for any individual who owns 25% or more of the business. Additionally, certain international transactions may require additional documentation to comply with OFAC regulations and international sanctions programs. Failure to provide requested information may result in transaction delays or account restrictions.',
  url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407715-Regulatory-Reporting-Guidelines',
  category: 'Compliance Resources',
  lastUpdated: '2024-03-05',
  owner: 'Anthony J.'
}, {
  id: '16',
  title: 'Data Privacy Compliance Framework',
  content: 'Novo adheres to a comprehensive data privacy framework that complies with relevant regulations including GDPR, CCPA, and other applicable privacy laws. We collect only the information necessary to provide our services and maintain regulatory compliance. Customer data is encrypted both in transit and at rest using industry-standard protocols. You have the right to access, correct, and request deletion of your personal information, subject to our legal retention requirements. We never sell customer data to third parties and only share information with service providers as necessary to deliver our services. For detailed information about how we handle your data, please review our Privacy Policy, which is updated regularly to reflect current practices and regulations.',
  url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407716-Data-Privacy-Compliance-Framework',
  category: 'Compliance Resources',
  lastUpdated: '2024-01-25',
  owner: 'Anthony J.'
}, {
  id: '17',
  title: 'Transaction Monitoring Requirements',
  content: 'To comply with federal regulations and protect against fraud, Novo employs automated transaction monitoring systems that review all account activity. These systems flag unusual transactions based on various risk factors, including transaction size, frequency, geographic location, and deviation from established patterns. When unusual activity is detected, we may temporarily restrict certain account features and contact you for verification. To avoid unnecessary restrictions, please inform us in advance of any unusual transactions, such as large deposits or international transfers. Business customers should also notify us of seasonal fluctuations or other expected changes in transaction patterns. We appreciate your cooperation in maintaining a secure banking environment.',
  url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407717-Transaction-Monitoring-Requirements',
  category: 'Compliance Resources',
  lastUpdated: '2024-02-12',
  owner: 'Anthony J.'
}, {
  id: '18',
  title: 'OFAC Sanctions Compliance',
  content: "Novo complies with all sanctions programs administered by the Office of Foreign Assets Control (OFAC). We screen all transactions and customers against OFAC's Specially Designated Nationals (SDN) list and other sanctions lists. Transactions involving sanctioned countries, entities, or individuals will be blocked as required by law. International wire transfers require additional information, including the purpose of payment and detailed recipient information, to ensure sanctions compliance. If you attempt to send funds to or receive funds from a sanctioned entity, the transaction will be rejected, and your account may be subject to additional review. For business customers engaging in international trade, we recommend implementing your own sanctions compliance procedures to avoid potential violations.",
  url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407718-OFAC-Sanctions-Compliance',
  category: 'Compliance Resources',
  lastUpdated: '2024-03-10',
  owner: 'Anthony J.'
}, {
  id: '19',
  title: 'Beneficial Ownership Documentation',
  content: "For business accounts, federal regulations require Novo to collect information about beneficial owners who directly or indirectly own 25% or more of the business, as well as individuals with significant control over the business. When opening an account or during periodic reviews, you must provide each beneficial owner's name, date of birth, address, and identification number (such as SSN). We also require a valid government-issued photo ID for verification purposes. Any changes to your ownership structure must be reported to Novo within 30 days. This information is kept confidential and is used only for regulatory compliance purposes. Failure to provide complete and accurate beneficial ownership information may result in account restrictions or closure.",
  url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407719-Beneficial-Ownership-Documentation',
  category: 'Compliance Resources',
  lastUpdated: '2024-02-28',
  owner: 'Anthony J.'
}];
export const mockAIResponses = [{
  query: 'How do I reset my password?',
  response: "Based on Novo's documentation, you can reset your password by clicking on the 'Forgot Password' link on the login page. You'll receive an email with instructions to create a new password. For security reasons, the password reset link will expire after 24 hours, so be sure to use it promptly.",
  complianceScore: 95,
  sources: [{
    title: 'Password Reset Guide',
    url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407701-Password-Reset-Guide',
    relevance: 0.95
  }, {
    title: 'Account Security Best Practices',
    url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407703-Account-Security-Best-Practices',
    relevance: 0.75
  }]
}, {
  query: 'How do I connect QuickBooks?',
  response: "According to Novo's help center, you can integrate your account with QuickBooks by navigating to Settings > Integrations > QuickBooks in your Novo dashboard. From there, follow the authorization steps to connect the two accounts. Once connected, your transactions will automatically sync with your QuickBooks account, streamlining your accounting workflow.",
  complianceScore: 92,
  sources: [{
    title: 'Integration with QuickBooks',
    url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407702-Integration-with-QuickBooks',
    relevance: 0.98
  }, {
    title: 'Integrations Overview',
    url: 'http://novo.zendesk.com/hc/en-us/articles/31348302407720-Integrations-Overview',
    relevance: 0.82
  }]
}];