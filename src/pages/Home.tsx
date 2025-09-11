import React from 'react';
import Spotlight from '../components/Spotlight';
import Layout from '../components/Layout';

const heroImg = '/main-image.jpeg';

const Home: React.FC = () => {
  return (
    <Layout>
      <section className="page-transition" style={{ minHeight: '80vh', display: 'grid', placeItems: 'center', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1200, width: '100%', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 28, alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 56, lineHeight: 1.1, marginBottom: 16 }}>Aureum Market</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 18, marginBottom: 28 }}>
              Where Heritage Meets the Horizon. An immersive marketplace for master artisans and their timeless creations.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="/explore" className="btn-primary">Explore the Crafts</a>
              <a href="/signup" className="btn-ghost">Join as an Artist</a>
            </div>
          </div>
          <Spotlight src={heroImg} alt="Artisan craft montage" radius={220} dimOpacity={0.4} className="gold-frame" />
        </div>
      </section>

      <section style={{ padding: '40px 24px' }}>
        <h2 style={{ marginBottom: 16 }}>Featured Artisans</h2>
        <div className="fade-in-up" style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: '160px', gap: 16, overflowX: 'auto', paddingBottom: 12 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="glass-panel" style={{ borderRadius: 12, padding: 12, textAlign: 'center' }}>
              <div style={{ width: 120, height: 120, borderRadius: '50%', margin: '0 auto 10px', background: 'linear-gradient(120deg, rgba(212,175,55,0.25), rgba(255,255,255,0.06))', border: '1px solid rgba(212,175,55,0.6)' }} />
              <div style={{ fontWeight: 600 }}>Artist {i + 1}</div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>Sculptor</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '40px 24px' }}>
        <h2 style={{ marginBottom: 16 }}>Curated Collections</h2>
        <div className="fade-in-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {['Sculptures of the Ancients', 'Woven Dreams', 'Echoes in Metal'].map((title, i) => (
            <div key={i} className="gold-frame" style={{ height: 220, position: 'relative', display: 'grid', placeItems: 'center', background: 'linear-gradient(180deg, rgba(212,175,55,0.12), rgba(255,255,255,0.02))' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22 }}>{title}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '60px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'center' }}>
          <div>
            <h2>Our Mission</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              We champion cultural heritage by connecting discerning patrons with master artisans across the globe. Each creation carries a story, and every purchase sustains a living tradition.
            </p>
          </div>
          <div className="gold-frame" style={{ height: 260 }} />
        </div>
      </section>

      <section style={{ padding: '60px 24px', textAlign: 'center' }}>
        <h2>Are you an artisan?</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>Join a curated community and showcase your craft to a global audience.</p>
        <a href="/signup" className="btn-ghost">Join as an Artist</a>
      </section>
    </Layout>
  );
};

export default Home;


