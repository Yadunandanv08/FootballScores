import React from 'react';
import '../styles/MatchItem.css';

function MatchItem({ match }) {
  const { fixture, league, teams, goals } = match;

  const formatMatchTime = () => {
    if (fixture.status.short === 'NS') {
      const matchTime = new Date(fixture.date);
      return matchTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (fixture.status.short === 'FT') {
      return 'Finished';
    } else if (fixture.status.short === 'HT') {
      return 'HT';
    } else {
      return fixture.status.short;
    }
  };

  return (
    <div className="match-item">
      <div className="match-league">
        <span>{league.name}</span>
      </div>
      
      <div className="match-time">
        {formatMatchTime()}
      </div>
      
      <div className="match-teams">
        <div className="team home">
          <span className="team-name">{teams.home.name}</span>
        </div>
        
        <div className="match-score">
          {fixture.status.short === 'NS' ? 'vs' : `${goals.home} - ${goals.away}`}
        </div>
        
        <div className="team away">
          <span className="team-name">{teams.away.name}</span>
        </div>
      </div>
    </div>
  );
}

export default MatchItem;