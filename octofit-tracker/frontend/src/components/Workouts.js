import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;
    console.log('Fetching workouts from:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts data received:', data);
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        console.log('Processed workouts:', workoutsData);
        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching workouts:', error);
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
          <p className="mt-3 text-muted">Loading workouts...</p>
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

  const getDifficultyBadge = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner':
        return 'bg-success';
      case 'intermediate':
        return 'bg-warning text-dark';
      case 'advanced':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="container mt-5 fade-in">
      <div className="page-header">
        <h2>💪 Workout Suggestions</h2>
        <p className="mb-0">Personalized workouts to help you reach your goals</p>
      </div>

      {workouts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💪</div>
          <h4>No Workouts Available</h4>
          <p className="text-muted">Check back soon for personalized workout suggestions!</p>
        </div>
      ) : (
        <div className="row">
          {workouts.map(workout => (
            <div key={workout.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-header bg-success text-white">
                  <h5 className="card-title mb-0">🎯 {workout.name}</h5>
                </div>
                <div className="card-body">
                  <p className="card-text text-muted">{workout.description}</p>
                  <hr />
                  <div className="mb-2">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Type:</span>
                      <span className="badge bg-info text-dark">
                        {workout.workout_type || workout.type || workout.activity_type || 'N/A'}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Duration:</span>
                      <span className="badge bg-primary">
                        {workout.duration || workout.duration_minutes || 0} minutes
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Difficulty:</span>
                      <span className={`badge ${getDifficultyBadge(workout.difficulty_level || workout.difficulty)}`}>
                        {workout.difficulty_level || workout.difficulty || 'Not specified'}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Calories:</span>
                      <span className="badge bg-success">
                        ~{workout.calories_burned || workout.calories || workout.estimated_calories || 0} kcal
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-top-0">
                  <button className="btn btn-success btn-sm w-100">
                    Start Workout
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {workouts.length > 0 && (
        <div className="mt-3 text-muted text-center">
          <small>Total Workouts: {workouts.length}</small>
        </div>
      )}
    </div>
  );
}

export default Workouts;
