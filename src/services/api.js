import axios from 'axios';

const API_KEY = 'b2d6b634169c47e9a163511a6a32f560';
const BASE_URL = '/api/v4';


const footballDataApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Auth-Token': API_KEY
  }
});

export const getLeagues = async () => {
  try {
    const response = await footballDataApi.get('/competitions');

    const transformedData = response.data.competitions.map(competition => ({
      league: {
        id: competition.id,
        name: competition.name,
        type: competition.type,
        logo: competition.emblem || ''
      },
      country: {
        name: competition.area.name,
        code: competition.area.code,
        flag: ''
      },
      seasons: [
        {
          year: new Date().getFullYear(),
          current: true
        }
      ]
    }));
    
    return transformedData;
  } catch (error) {
    console.error('Failed to fetch leagues:', error);
    throw error;
  }
};

export const fetchFixtures = async (params = {}) => {
    try {
      let endpoint = '/matches';
      const apiParams = {};
  
      if (params.pastDays) {
        const today = new Date();
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - params.pastDays);
        
        apiParams.dateFrom = pastDate.toISOString().split('T')[0];
        apiParams.dateTo = today.toISOString().split('T')[0];
      }
  
      if (params.league) {
        endpoint = `/competitions/${params.league}/matches`;
      }
  
      const response = await footballDataApi.get(endpoint, { params: apiParams });
  
      let transformedMatches = response.data.matches.map(match => ({
        fixture: {
          id: match.id,
          date: match.utcDate,
          status: {
            short: getShortStatus(match.status),
            long: match.status
          }
        },
        league: {
          id: match.competition.id,
          name: match.competition.name,
          logo: match.competition.emblem || ''
        },
        teams: {
          home: {
            id: match.homeTeam.id,
            name: match.homeTeam.shortName || match.homeTeam.name,
            logo: match.homeTeam.crest || ''
          },
          away: {
            id: match.awayTeam.id,
            name: match.awayTeam.shortName || match.awayTeam.name,
            logo: match.awayTeam.crest || ''
          }
        },
        goals: {
          home: match.score.fullTime?.home ?? null,
          away: match.score.fullTime?.away ?? null
        }
      }));
  
      transformedMatches.sort((a, b) => {
        const statusOrder = { LIVE: 1, IN_PLAY: 2, PAUSED: 3, SCHEDULED: 4, FINISHED: 5 };
        const statusA = statusOrder[a.fixture.status.long] || 10;
        const statusB = statusOrder[b.fixture.status.long] || 10;
  
        if (statusA !== statusB) {
          return statusA - statusB;
        }
        return new Date(b.fixture.date) - new Date(a.fixture.date);
      });
  
      return { response: transformedMatches };
    } catch (error) {
      console.error('Failed to fetch fixtures:', error);
      throw error;
    }
  };
    

function getShortStatus(status) {
  switch (status) {
    case 'SCHEDULED':
      return 'NS'; 
    case 'LIVE':
      return '1H'; 
    case 'IN_PLAY':
      return '2H'; 
    case 'PAUSED':
      return 'HT'; 
    case 'FINISHED':
      return 'FT'; 
    case 'POSTPONED':
      return 'PST'; 
    case 'SUSPENDED':
      return 'SUSP'; 
    case 'CANCELED':
      return 'CAN'; 
    default:
      return status;
  }
}