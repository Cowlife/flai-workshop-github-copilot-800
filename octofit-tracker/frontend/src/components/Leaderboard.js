import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
    console.log('Fetching leaderboard from:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard data received:', data);
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        console.log('Processed leaderboard:', leaderboardData);
        
        // Debug: Log first entry structure if available
        if (leaderboardData && leaderboardData.length > 0) {
          console.log('First leaderboard entry structure:', leaderboardData[0]);
          console.log('Team field:', leaderboardData[0].team);
          console.log('Team name field:', leaderboardData[0].team_name);
          console.log('Calories field:', leaderboardData[0].total_calories || leaderboardData[0].calories);
        }
        
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const getRankBadgeClass = (index) => {
    if (index === 0) return 'bg-warning text-dark';
    if (index === 1) return 'bg-secondary';
    if (index === 2) return 'bg-info';
    return 'bg-primary';
  };

  const getRankIcon = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  };

  return (
    <div className="container mt-5 fade-in">
      <div className="page-header">
        <h2>🏆 Leaderboard</h2>
        <p className="mb-0">Compete and climb the ranks!</p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏆</div>
          <h4>No Rankings Yet</h4>
          <p className="text-muted">Complete activities to appear on the leaderboard!</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col" style={{width: '100px'}}>Rank</th>
                  <th scope="col">User</th>
                  <th scope="col">Team</th>
                  <th scope="col">Total Calories</th>
                  <th scope="col">Total Points</th>
                  <th scope="col">Activities</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => {
                  // Extract team name with multiple fallbacks
                  const teamName = entry.team_name 
                    || entry.team?.name 
                    || (typeof entry.team === 'string' ? entry.team : null)
                    || entry.team_id
                    || null;
                  
                  // Extract calories with multiple fallbacks
                  const calories = entry.total_calories 
                    || entry.calories_burned 
                    || entry.calories 
                    || entry.total_calories_burned
                    || 0;
                  
                  return (
                    <tr key={entry.id || index}>
                      <td>
                        <span className={`badge badge-rank ${getRankBadgeClass(index)}`}>
                          {getRankIcon(index)} {index + 1}
                        </span>
                      </td>
                      <td><strong>{entry.user_name || entry.username || entry.user || 'Unknown'}</strong></td>
                      <td>
                        {teamName ? (
                          <span className="badge bg-info text-dark">
                            {teamName}
                          </span>
                        ) : (
                          <span className="text-muted">No Team</span>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-warning text-dark">
                          {calories} kcal
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-success">
                          {entry.total_points || entry.points || entry.score || 0} pts
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {entry.activity_count || entry.activities || entry.total_activities || 0} activities
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-muted">
            <small>Total Participants: {leaderboard.length}</small>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
