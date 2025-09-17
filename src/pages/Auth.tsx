import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const Modal: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', zIndex: 80 }}>
    <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.25)' }} />
    <div className="glass-panel" style={{ position: 'relative', width: 520, maxWidth: '92vw', borderRadius: 16, padding: 16 }}>
      <div className="gold-frame" style={{ height: 120, borderRadius: 12, marginBottom: 12, display: 'grid', placeItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-serif)' }}>{title}</div>
      </div>
      {children}
    </div>
  </div>
);

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Modal title="Welcome back, artisan">
        <form style={{ display: 'grid', gap: 12 }} onSubmit={handleSubmit}>
          {error && (
            <div style={{ color: 'red', padding: '8px', background: 'rgba(255,0,0,0.1)', borderRadius: '4px' }}>
              {error}
            </div>
          )}
          <label>
            Email
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            Don't have an account? <a href="/signup" style={{ color: 'var(--color-gold)' }}>Sign up</a>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    userType: 'artisan' as 'artisan' | 'buyer',
    categories: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signup(formData.email, formData.password, {
        name: formData.name,
        location: formData.location,
        userType: formData.userType,
        categories: formData.categories ? formData.categories.split(',').map(c => c.trim()) : []
      });
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Layout>
      <Modal title="Begin your creation">
        <form style={{ display: 'grid', gap: 12 }} onSubmit={handleSubmit}>
          {error && (
            <div style={{ color: 'red', padding: '8px', background: 'rgba(255,0,0,0.1)', borderRadius: '4px' }}>
              {error}
            </div>
          )}
          <label>
            Name *
            <input
              className="input"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email *
            <input
              className="input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password *
            <input
              className="input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            I am an:
            <select
              className="input"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
            >
              <option value="artisan">Artisan</option>
              <option value="buyer">Art Enthusiast</option>
            </select>
          </label>
          <label>
            Location
            <input
              className="input"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
            />
          </label>
          {formData.userType === 'artisan' && (
            <label>
              Craft Categories
              <input
                className="input"
                name="categories"
                value={formData.categories}
                onChange={handleChange}
                placeholder="e.g. Pottery, Weaving, Sculpture"
              />
            </label>
          )}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            Already have an account? <a href="/login" style={{ color: 'var(--color-gold)' }}>Sign in</a>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default Login;


