import React from 'react';
import Layout from '../components/Layout';

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <section className="page-transition" style={{ padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          <aside className="glass-panel" style={{ borderRadius: 12, padding: 12, height: 'fit-content' }}>
            <div style={{ padding: 8, color: 'var(--color-text-secondary)' }}>Dashboard</div>
            <div style={{ padding: 8, color: 'var(--color-text-secondary)' }}>My Crafts</div>
            <div style={{ padding: 8, color: 'var(--color-text-secondary)' }}>Orders</div>
            <div style={{ padding: 8, color: 'var(--color-text-secondary)' }}>Profile Settings</div>
          </aside>
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="glass-panel" style={{ borderRadius: 12, padding: 16 }}>
              <h2>Overview</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                <div className="gold-frame" style={{ padding: 12 }}>
                  <div style={{ color: 'var(--color-text-secondary)' }}>Total Sales</div>
                  <div>$12,480</div>
                </div>
                <div className="gold-frame" style={{ padding: 12 }}>
                  <div style={{ color: 'var(--color-text-secondary)' }}>Pending Orders</div>
                  <div>3</div>
                </div>
                <div className="gold-frame" style={{ padding: 12 }}>
                  <div style={{ color: 'var(--color-text-secondary)' }}>Active Listings</div>
                  <div>14</div>
                </div>
              </div>
            </div>
            <div className="glass-panel" style={{ borderRadius: 12, padding: 16 }}>
              <h2>My Crafts</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="gold-frame" style={{ height: 120 }} />
                ))}
              </div>
              <button className="btn-primary" style={{ marginTop: 12 }}>Add New Craft</button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;


