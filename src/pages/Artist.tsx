import React from 'react';
import Layout from '../components/Layout';

const Artist: React.FC = () => {
  return (
    <Layout>
      <section className="page-transition" style={{ padding: '24px 16px' }}>
        <div className="gold-frame" style={{ height: 220, position: 'relative', marginBottom: -40 }} />
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', border: '1px solid rgba(212,175,55,0.65)', background: 'linear-gradient(120deg, rgba(212,175,55,0.25), rgba(255,255,255,0.06))' }} />
          <div>
            <h1 style={{ margin: 0 }}>Ari V.</h1>
            <div style={{ color: 'var(--color-text-secondary)' }}>Tbilisi, Georgia</div>
          </div>
        </div>
        <section style={{ marginTop: 24 }}>
          <h2>My Story</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            I shape clay to capture celestial phenomena—sunrise on oxidized copper, moonlit ash, and the quiet echo of distant constellations.
          </p>
        </section>
        <section style={{ marginTop: 24 }}>
          <h2>Artworks</h2>
          <div style={{ columnCount: 1, columnGap: 16 }}>
            {/* This should be populated with actual artist products from the database */}
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
              <p>No artworks available yet.</p>
              <p>This section will display the artist's portfolio when products are added.</p>
            </div>
          </div>
        </section>
      </section>
    </Layout>
  );
};

export default Artist;


