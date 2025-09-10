import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './ArtistAuthForm.css';

const ArtistAuthForm = ({ onClose, onSwitchToLogin }) => {
  const navigate = useNavigate();
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    phone: '',
    instagram: ''
  });

  // Categories state
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

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle category selection
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
    console.log('Form data:', formData);
    console.log('Selected categories:', selectedCategories);

    try {
      // Validation: Check if at least one category is selected
      if (selectedCategories.length === 0) {
        throw new Error('Please select at least one artist category');
      }

      // Validation: Check required fields
      if (!formData.name || !formData.email || !formData.password || !formData.location) {
        throw new Error('Please fill in all required fields');
      }

      // Create user with Firebase Authentication
      console.log('Creating user with email:', formData.email);
      console.log('Auth object:', auth);
      console.log('Auth app:', auth.app);
      
      let user;
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        user = userCredential.user;
        console.log('User created successfully:', user.uid);
      } catch (authError) {
        console.error('Authentication error:', authError);
        console.error('Auth error code:', authError.code);
        console.error('Auth error message:', authError.message);
        throw authError;
      }

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
      console.log('User UID:', user.uid);
      console.log('Database reference:', db);
      
      try {
        await setDoc(doc(db, 'artists', user.uid), artistData);
        console.log('Artist data stored successfully in Firestore');
      } catch (firestoreError) {
        console.error('Firestore specific error:', firestoreError);
        console.error('Firestore error code:', firestoreError.code);
        throw firestoreError;
      }

      // Redirect to artist dashboard
      navigate('/artist-dashboard');

    } catch (error) {
      console.error('Error creating artist account:', error);
      console.error('Error code:', error.code);
      console.error('Error details:', error);
      
      // More specific error messages
      let errorMessage = 'An error occurred while creating your account';
      
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
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="artist-form-backdrop" onClick={onClose}>
      <div className="artist-form-content" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="artist-form">
          <h2 className="form-title">Join Our Artist Community</h2>
          <p className="form-subtitle">
            Create your artist profile and start showcasing your work to the world
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
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>

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
                placeholder="Create a secure password"
                minLength="6"
              />
            </div>

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
          </div>

          {/* Artist Categories */}
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

          {/* Submit button */}
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Login link */}
          <div className="form-footer">
            <p>Already have an account? 
              <button 
                type="button" 
                className="link-button"
                onClick={onSwitchToLogin}
              >
                Login here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArtistAuthForm;
