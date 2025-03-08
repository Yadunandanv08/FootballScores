import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LeagueSelector from './components/LeagueSelector';
import MatchList from './components/MatchList';
import LoadingSpinner from './components/LoadingSpinner';
import { getLeagues, fetchFixtures } from './services/api';
import './App.css';

function App() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('today'); 
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); 

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLeagues();
        setLeagues(data);
        
        const premierLeague = data.find(league => 
          league.league.name.includes('Premier League') || 
          league.league.name.includes('PL')
        );
        setSelectedLeague(premierLeague ? premierLeague.league.id : data[0]?.league.id || null);
      } catch (error) {
        console.error('Failed to fetch leagues:', error);
        setError('Unable to load leagues. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!selectedLeague) return;
      
      setLoading(true);
      setError(null);
      try {
        const params = view === 'live' 
          ? { live: 'all' } 
          : { date: date, league: selectedLeague };
        
        const data = await fetchFixtures(params);
        setMatches(data.response || []);
      } catch (error) {
        console.error('Failed to fetch matches:', error);
        setError('Unable to load matches. Please try again later.');
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [selectedLeague, date, view]);


  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === 'today') {
      setDate(new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <div className="app">
      <Header onViewChange={handleViewChange} currentView={view} />
      <div className="container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <LeagueSelector 
          leagues={leagues} 
          selectedLeague={selectedLeague} 
          onSelectLeague={setSelectedLeague} 
        />
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <MatchList matches={matches} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;