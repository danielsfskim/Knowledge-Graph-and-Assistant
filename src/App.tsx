import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { AIAssistantProvider } from './context/AIAssistantContext';
export function App() {
  return <AIAssistantProvider>
      <Layout />
    </AIAssistantProvider>;
}