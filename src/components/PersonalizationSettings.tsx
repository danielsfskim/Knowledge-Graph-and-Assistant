import React from 'react';
export function PersonalizationSettings() {
  const integrations = [{
    name: 'Slack',
    logo: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg'
  }, {
    name: 'Gmail',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg'
  }, {
    name: 'Confluence Wiki',
    logo: 'https://cdn.worldvectorlogo.com/logos/confluence-1.svg'
  }, {
    name: 'Google Drive',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg'
  }, {
    name: 'Zoom',
    logo: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg'
  }, {
    name: 'Zendesk',
    logo: 'https://cdn.worldvectorlogo.com/logos/zendesk-1.svg'
  }];
  const handleIntegrationClick = (name: string) => {
    // This would be replaced with actual integration logic
    console.log(`Connecting to ${name}...`);
    alert(`Connecting to ${name}...`);
  };
  return <div className="mt-2 p-3 bg-gray-50 rounded-md">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Available Integrations
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {integrations.map(integration => <button key={integration.name} onClick={() => handleIntegrationClick(integration.name)} className="flex flex-col items-center p-3 border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-colors">
            <img src={integration.logo} alt={`${integration.name} logo`} className="h-8 w-8 mb-2 object-contain" />
            <span className="text-xs font-medium text-gray-700">
              {integration.name}
            </span>
          </button>)}
      </div>
      <p className="mt-3 text-xs text-gray-500 text-center">
        Click on an integration to connect your account
      </p>
    </div>;
}