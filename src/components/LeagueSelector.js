import React, { useEffect } from 'react';
import '../styles/LeagueSelector.css';

function LeagueSelector({ leagues, selectedLeague, onSelectLeague }) {
  useEffect(() => {
    if (!selectedLeague && leagues.length > 0) {
      const premierLeague = leagues.find(l => l.league.name === "Premier League");
      if (premierLeague) {
        onSelectLeague(premierLeague.league.id);
      } else if (leagues.length > 0) {
        onSelectLeague(leagues[0].league.id);
      }
    }
  }, [leagues, selectedLeague, onSelectLeague]);

  return (
    <div className="league-selector">
      <h2>Select League</h2>
      <div className="leagues-container">
        {leagues.map((leagueItem) => (
          <div 
            key={leagueItem.league.id}
            className={`league-item ${leagueItem.league.id === selectedLeague ? 'selected' : ''}`}
            onClick={() => onSelectLeague(leagueItem.league.id)}
          >
            {leagueItem.league.logo && (
              <img 
                src={leagueItem.league.logo} 
                alt={leagueItem.league.name} 
                className="league-logo"
              />
            )}
            <span>{leagueItem.league.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeagueSelector;