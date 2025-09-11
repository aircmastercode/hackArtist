import React from 'react';
import Layout from '../components/Layout';

const Contact: React.FC = () => {
  return (
    <Layout>
      <section className="page-transition" style={{ padding: '40px 24px' }}>
        <div className="gold-frame" style={{ height: 160, display: 'grid', placeItems: 'center', marginBottom: 24 }}>
          <h1>Contact</h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <h2>Get in Touch</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              We’re here to help with commissions, curation, and partnerships.
            </p>
            <p>Email: hello@aureum.market<br/>Phone: +1 (555) 013-8013</p>
          </div>
          <form className="glass-panel" style={{ padding: 16, borderRadius: 12 }} onSubmit={(e) => e.preventDefault()}>
            <label>
              Name
              <input className="input" style={{ width: '100%' }} />
            </label>
            <label>
              Email
              <input className="input" style={{ width: '100%' }} />
            </label>
            <label>
              Subject
              <input className="input" style={{ width: '100%' }} />
            </label>
            <label>
              Message
              <textarea className="input" style={{ width: '100%', minHeight: 100 }} />
            </label>
            <button className="btn-primary" style={{ marginTop: 12 }}>Send</button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;


