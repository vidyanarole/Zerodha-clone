import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BACKEND_URL, DASHBOARD_URL } from '../../config';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await axios.post(`${BACKEND_URL}/login`, formData);
      setSuccessMsg("Login successful! Redirecting to dashboard...");
      
      const { token } = response.data;
      
      // Perform cross-app authentication redirect handshake
      setTimeout(() => {
        window.location.href = `${DASHBOARD_URL}?token=${token}`;
      }, 1000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg('Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm p-4">
            <div className="text-center mb-4">
              <img src="media/images/logo.svg" style={{ width: "20%" }} alt="Kite Logo" className="mb-2" />
              <h2>Login to Kite</h2>
            </div>
            
            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-100 mt-3" 
                style={{ backgroundColor: '#f56834', border: 'none' }}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div className="mt-3 text-center">
              <small className="text-muted">
                Don't have an account? <Link to="/signup" style={{ color: '#f56834', textDecoration: 'none' }}>Sign up</Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
