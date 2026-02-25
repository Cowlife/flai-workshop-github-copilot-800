import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
    console.log('Fetching teams from:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Teams data received:', data);
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        console.log('Processed teams:', teamsData);
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
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
          <p className="mt-3 text-muted">Loading teams...</p>
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

  return (
    <div className="container mt-5 fade-in">
      <div className="page-header">
        <h2>👥 Teams</h2>
        <p className="mb-0">Join a team and compete together!</p>
      </div>

      {teams.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h4>No Teams Yet</h4>
          <p className="text-muted">Create a team to get started!</p>
        </div>
      ) : (
        <div className="row">
          {teams.map(team => (
            <div key={team.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-header bg-primary text-white">
                  <h5 className="card-title mb-0">🎯 {team.name}</h5>
                </div>
                <div className="card-body">
                  <p className="card-text text-muted">{team.description}</p>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">Members:</span>
                    <span className="badge bg-primary rounded-pill">
                      {team.member_count || team.members_count || team.total_members || 
                       (Array.isArray(team.members) ? team.members.length : 0)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Created:</span>
                    <small>
                      {team.created_at ? (() => {
                        const date = new Date(team.created_at);
                        return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
                      })() : 'N/A'}
                    </small>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-top-0">
                  <button className="btn btn-outline-primary btn-sm w-100">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {teams.length > 0 && (
        <div className="mt-3 text-muted text-center">
          <small>Total Teams: {teams.length}</small>
        </div>
      )}
    </div>
  );
}

export default Teams;
