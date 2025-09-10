import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = ({ onClose, onSwitchToSignup }) => {
  const navigate = useNavigate();
  
  // Form data state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // UI feedback states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Set loading state and clear errors
    setLoading(true);
    setError('');

    console.log('Login attempt with email:', formData.email);

    try {
      // Validation: Check required fields
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      // Sign in with Firebase Authentication
      console.log('Signing in user with email:', formData.email);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;
      console.log('User signed in successfully:', user.uid);

      // Redirect to artist dashboard
      navigate('/artist-dashboard');

    } catch (error) {
      console.error('Error signing in:', error);
      console.error('Error code:', error.code);
      console.error('Error details:', error);
      
      // More specific error messages
      let errorMessage = 'An error occurred while signing in';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-backdrop" onClick={onClose}>
      <div className="login-form-content" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="form-title">Welcome Back</h2>
          <p className="form-subtitle">
            Sign in to your artist account
          </p>

          {/* Error display */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Form fields */}
          <div className="form-fields">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email address"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          {/* Sign up link */}
          <div className="form-footer">
            <p>Don't have an account? 
              <button 
                type="button" 
                className="link-button"
                onClick={onSwitchToSignup}
              >
                Sign up here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
