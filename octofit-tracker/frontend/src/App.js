import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img 
                src="/octofitapp-small.png" 
                alt="OctoFit Logo" 
                className="navbar-logo"
              />
              <strong>OctoFit Tracker</strong>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/users">
                    Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">
                    Teams
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/activities">
                    Activities
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">
                    Leaderboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/workouts">
                    Workouts
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={
              <div className="container mt-5 fade-in">
                <div className="jumbotron text-center">
                  <h1 className="display-3 fw-bold">Welcome to OctoFit Tracker</h1>
                  <p className="lead mt-3">
                    🏋️ Track your fitness activities, compete with teams, and achieve your goals!
                  </p>
                  <hr className="my-4 bg-white" style={{opacity: 0.3}} />
                  <p className="fs-5">
                    Start by exploring users, teams, activities, and workout suggestions.
                  </p>
                  <div className="mt-5 d-flex gap-3 justify-content-center flex-wrap">
                    <Link to="/activities" className="btn btn-primary btn-lg">
                      📊 View Activities
                    </Link>
                    <Link to="/leaderboard" className="btn btn-success btn-lg">
                      🏆 View Leaderboard
                    </Link>
                    <Link to="/workouts" className="btn btn-outline-light btn-lg">
                      💪 Workouts
                    </Link>
                  </div>
                </div>
                
                <div className="row mt-5">
                  <div className="col-md-4 mb-4">
                    <div className="card text-center">
                      <div className="card-body">
                        <div className="display-4 mb-3">👥</div>
                        <h5 className="card-title">Join Teams</h5>
                        <p className="card-text text-muted">Connect with others and compete together</p>
                        <Link to="/teams" className="btn btn-outline-primary">Browse Teams</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-4">
                    <div className="card text-center">
                      <div className="card-body">
                        <div className="display-4 mb-3">🏃</div>
                        <h5 className="card-title">Track Activities</h5>
                        <p className="card-text text-muted">Log your workouts and monitor progress</p>
                        <Link to="/activities" className="btn btn-outline-primary">View Activities</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-4">
                    <div className="card text-center">
                      <div className="card-body">
                        <div className="display-4 mb-3">👤</div>
                        <h5 className="card-title">Community</h5>
                        <p className="card-text text-muted">Meet fellow fitness enthusiasts</p>
                        <Link to="/users" className="btn btn-outline-primary">View Users</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            } />
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/workouts" element={<Workouts />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="bg-dark text-white text-center py-3 mt-5">
          <p className="mb-0">© 2026 OctoFit Tracker - Track Your Fitness Journey</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
