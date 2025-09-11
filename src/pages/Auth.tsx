import React from 'react';
import Layout from '../components/Layout';

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
  return (
    <Layout>
      <Modal title="Welcome back, artisan">
        <form style={{ display: 'grid', gap: 12 }} onSubmit={(e) => e.preventDefault()}>
          <label>Email<input className="input" /></label>
          <label>Password<input className="input" type="password" /></label>
          <button className="btn-primary">Sign In</button>
        </form>
      </Modal>
    </Layout>
  );
};

export const Signup: React.FC = () => {
  return (
    <Layout>
      <Modal title="Begin your creation">
        <form style={{ display: 'grid', gap: 12 }} onSubmit={(e) => e.preventDefault()}>
          <label>Name<input className="input" /></label>
          <label>Email<input className="input" /></label>
          <label>Password<input className="input" type="password" /></label>
          <label>Location<input className="input" /></label>
          <label>Categories<input className="input" /></label>
          <button className="btn-primary">Create Account</button>
        </form>
      </Modal>
    </Layout>
  );
};

export default Login;


