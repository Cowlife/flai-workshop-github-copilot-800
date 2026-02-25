import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    team: ''
  });
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, []);

  const fetchUsers = () => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
    console.log('Fetching users from:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Users data received:', data);
        const usersData = data.results || data;
        console.log('Processed users:', usersData);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  const fetchTeams = () => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
    console.log('Fetching teams from:', apiUrl);

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const teamsData = data.results || data;
        console.log('Teams loaded:', teamsData);
        setTeams(Array.isArray(teamsData) ? teamsData : []);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
      });
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      username: user.username || '',
      team: user.team || user.team_id || ''
    });
    setSaveError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/${editingUser.id}/`;
    console.log('Saving user to:', apiUrl, formData);

    try {
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const updatedUser = await response.json();
      console.log('User updated:', updatedUser);

      // Refresh users list
      fetchUsers();
      
      // Close modal
      setEditingUser(null);
      
      // Reset Bootstrap modal
      const modalElement = document.getElementById('editUserModal');
      const modal = window.bootstrap?.Modal?.getInstance(modalElement);
      if (modal) modal.hide();
      
    } catch (error) {
      console.error('Error saving user:', error);
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setEditingUser(null);
    setSaveError(null);
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading users...</p>
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
        <h2>👤 Users</h2>
        <p className="mb-0">Meet our fitness community members</p>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <h4>No Users Yet</h4>
          <p className="text-muted">Be the first to join!</p>
        </div>
      ) : (
        <div className="row">
          {users.map(user => (
            <div key={user.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                         style={{width: '50px', height: '50px', fontSize: '1.5rem'}}>
                      {user.username?.charAt(0).toUpperCase() || user.first_name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="ms-3">
                      <h5 className="card-title mb-0">
                        {user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}` 
                          : user.name || user.username}
                      </h5>
                      <small className="text-muted">@{user.username}</small>
                    </div>
                  </div>
                  <hr />
                  <div className="mb-2">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Email:</span>
                      <small>{user.email}</small>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Team:</span>
                      {user.team_name ? (
                        <span className="badge bg-info text-dark">{user.team_name}</span>
                      ) : (
                        <span className="text-muted">No team</span>
                      )}
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Member since:</span>
                      <small>{new Date(user.date_joined).toLocaleDateString()}</small>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-top-0">
                  <button 
                    className="btn btn-outline-primary btn-sm w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#editUserModal"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit User
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {users.length > 0 && (
        <div className="mt-3 text-muted text-center">
          <small>Total Users: {users.length}</small>
        </div>
      )}

      {/* Edit User Modal */}
      <div className="modal fade" id="editUserModal" tabIndex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="editUserModalLabel">
                ✏️ Edit User Details
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
            </div>
            <form onSubmit={handleSaveUser}>
              <div className="modal-body">
                {saveError && (
                  <div className="alert alert-danger" role="alert">
                    <strong>Error:</strong> {saveError}
                  </div>
                )}
                
                <div className="mb-3">
                  <label htmlFor="first_name" className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="last_name" className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled
                    title="Username cannot be changed"
                  />
                  <small className="text-muted">Username cannot be changed</small>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="team" className="form-label">Team</label>
                  <select
                    className="form-select"
                    id="team"
                    name="team"
                    value={formData.team}
                    onChange={handleInputChange}
                  >
                    <option value="">No Team</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  <small className="text-muted">Select a team for this user</small>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  data-bs-dismiss="modal"
                  onClick={handleCloseModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    '💾 Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
