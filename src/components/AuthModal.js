import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';

const AuthModal = ({ onClose }) => {
  const navigate = useNavigate();
  
  // Modal state
  const [isLogin, setIsLogin] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    phone: '',
    instagram: ''
  });

  // Categories state (for signup only)
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  // UI feedback states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Predefined artist categories
  const artistCategories = [
    'Painter',
    'Sculptor',
    'Digital Artist',
    'Photographer',
    'Illustrator',
    'Mixed Media',
    'Street Artist',
    'Ceramic Artist',
    'Textile Artist',
    'Performance Artist',
    'Other'
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle category selection (signup only)
  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Set loading state and clear errors
    setLoading(true);
    setError('');

    console.log('Form submission started');
    console.log('Is login mode:', isLogin);
    console.log('Form data:', formData);

    try {
      if (isLogin) {
        // LOGIN LOGIC
        if (!formData.email || !formData.password) {
          throw new Error('Please fill in all fields');
        }

        console.log('Signing in user with email:', formData.email);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        const user = userCredential.user;
        console.log('User signed in successfully:', user.uid);

      } else {
        // SIGNUP LOGIC
        if (selectedCategories.length === 0) {
          throw new Error('Please select at least one artist category');
        }

        if (!formData.name || !formData.email || !formData.password || !formData.location) {
          throw new Error('Please fill in all required fields');
        }

        console.log('Creating user with email:', formData.email);
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        const user = userCredential.user;
        console.log('User created successfully:', user.uid);

        // Store artist data in Firestore
        const artistData = {
          uid: user.uid,
          name: formData.name,
          email: formData.email,
          location: formData.location,
          phone: formData.phone || '',
          instagram: formData.instagram || '',
          categories: selectedCategories,
          createdAt: new Date().toISOString(),
          profileComplete: true
        };
        
        console.log('Storing artist data in Firestore:', artistData);
        await setDoc(doc(db, 'artists', user.uid), artistData);
        console.log('Artist data stored successfully in Firestore');
      }

      // Redirect to artist dashboard
      navigate('/artist-dashboard');

    } catch (error) {
      console.error('Authentication error:', error);
      console.error('Error code:', error.code);
      console.error('Error details:', error);
      
      // More specific error messages
      let errorMessage = 'An error occurred';
      
      if (isLogin) {
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
        }
      } else {
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'This email is already registered. Please use a different email.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'Password should be at least 6 characters long.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.code === 'permission-denied') {
          errorMessage = 'Permission denied. Please check your Firebase rules.';
        } else if (error.code === 'unavailable') {
          errorMessage = 'Service temporarily unavailable. Please try again.';
        }
      }
      
      if (error.message && !error.code) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Toggle between login and signup
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      location: '',
      phone: '',
      instagram: ''
    });
    setSelectedCategories([]);
  };

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <h2 className="form-title">
            {isLogin ? 'Welcome Back' : 'Join Our Artist Community'}
          </h2>
          <p className="form-subtitle">
            {isLogin 
              ? 'Sign in to your artist account' 
              : 'Create your artist profile and start showcasing your work to the world'
            }
          </p>

          {/* Error display */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Form fields */}
          <div className="form-fields">
            {!isLogin && (
              <div className="input-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div className="input-group">
              <label htmlFor="email">Email Address *</label>
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
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder={isLogin ? "Enter your password" : "Create a secure password"}
                minLength={isLogin ? undefined : "6"}
              />
            </div>

            {!isLogin && (
              <>
                <div className="input-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="City, Country"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Optional - Enter your phone number"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="instagram">Instagram Username</label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="Optional - Your Instagram handle"
                  />
                </div>
              </>
            )}
          </div>

          {/* Artist Categories (signup only) */}
          {!isLogin && (
            <div className="categories-section">
              <label className="categories-label">What type of artist are you? *</label>
              <div className="categories-grid">
                {artistCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`category-button ${selectedCategories.includes(category) ? 'selected' : ''}`}
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading 
              ? (isLogin ? 'Signing In...' : 'Creating Account...') 
              : (isLogin ? 'Sign In' : 'Create Account')
            }
          </button>

          {/* Toggle mode */}
          <div className="form-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                className="link-button"
                onClick={toggleMode}
              >
                {isLogin ? 'Sign up here' : 'Login here'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
