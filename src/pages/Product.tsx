import React, { useState } from 'react';
import Layout from '../components/Layout';
import Spotlight from '../components/Spotlight';
import { useCart } from '../context/CartContext';
import type { Artwork } from '../types';

const base: Artwork = {
  id: 'sample-1',
  title: 'Celestial Vessel',
  imageUrl: '/main-image.jpeg',
  priceUsd: 1450,
  artistId: 'artist-1',
  artistName: 'Ari V.',
  description: 'Hand-thrown vessel infused with mineral glazes, fired under moonlight.',
};

const Product: React.FC = () => {
  const { add } = useCart();
  const [active, setActive] = useState<string>(base.imageUrl);
  const thumbs = [base.imageUrl, base.imageUrl, base.imageUrl, base.imageUrl];

  return (
    <Layout>
      <section className="page-transition" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 28 }}>
          <div>
            <Spotlight src={active} alt={base.title} radius={220} dimOpacity={0.45} className="gold-frame" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 10 }}>
              {thumbs.map((t, i) => (
                <button key={i} onClick={() => setActive(t)} className="gold-frame" style={{ padding: 0, background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <img src={t} alt={`thumb-${i}`} style={{ width: '100%', display: 'block' }} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h1 style={{ marginTop: 0 }}>{base.title}</h1>
            <a href={`/artist/${base.artistId}`} style={{ color: 'var(--color-gold)', textDecoration: 'none' }}>{base.artistName}</a>
            <div style={{ fontSize: 22, marginTop: 8 }}>${base.priceUsd.toLocaleString()}</div>
            <p style={{ color: 'var(--color-text-secondary)' }}>{base.description}</p>
            <button className="btn-primary" onClick={() => add(base)}>
              Add to Cart
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Product;


