import React from 'react';
import MatchItem from './MatchItem';
import '../styles/MatchList.css';

function MatchList({ matches }) {
  if (!matches || matches.length === 0) {
    return <div className="no-matches">No matches found for the selected criteria.</div>;
  }

  return (
    <div className="match-list">
      {matches.map((match) => (
        <MatchItem key={match.fixture.id} match={match} />
      ))}
    </div>
  );
}

export default MatchList;