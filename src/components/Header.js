import React from 'react';
import '../styles/Header.css';

function Header({ onViewChange, currentView }) {
  return (
    <header className="header">
      <h1>Football Scores</h1>
      <div className="view-options">
        <button 
          className={currentView === 'today' ? 'active' : ''} 
          onClick={() => onViewChange('today')}
        >
          Today
        </button>
        <button 
          className={currentView === 'live' ? 'active' : ''} 
          onClick={() => onViewChange('live')}
        >
          Live
        </button>
      </div>
    </header>
  );
}

export default Header;