import React from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <MainContent />
    </div>
  );
};

export default App;
