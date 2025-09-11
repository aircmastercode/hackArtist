import React, { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import type { Artwork } from '../types';

const seedArtworks: Artwork[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `art-${i + 1}`,
  title: `Artifact ${i + 1}`,
  imageUrl: '/main-image.jpeg',
  priceUsd: 1200 + i * 50,
  artistId: `artist-${(i % 5) + 1}`,
  artistName: `Artist ${(i % 5) + 1}`,
  category: i % 2 ? 'Sculpture' : 'Textile',
  region: i % 3 ? 'Asia' : 'Africa',
}));

const Explore: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>(seedArtworks);
  const [page, setPage] = useState(1);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setPage((p) => p + 1);
        }
      });
    }, { rootMargin: '800px 0px 800px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (page === 1) return;
    const more = seedArtworks.map((a, i) => ({ ...a, id: `${a.id}-p${page}-${i}` }));
    setArtworks((prev) => [...prev, ...more]);
  }, [page]);

  return (
    <Layout>
      <section className="page-transition" style={{ padding: '24px 16px' }}>
        <div
          className="glass-panel"
          style={{
            position: 'sticky',
            top: 76,
            zIndex: 5,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 20,
            padding: '12px 12px',
            borderRadius: 12,
          }}
        >
          <h1 style={{ margin: 0, flex: 'none' }}>Explore the Collection</h1>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
            <select className="input" style={{ background: 'transparent', color: 'var(--color-text-secondary)' }}>
              <option>All Types</option>
              <option>Sculpture</option>
              <option>Textile</option>
            </select>
            <select className="input" style={{ background: 'transparent', color: 'var(--color-text-secondary)' }}>
              <option>All Regions</option>
              <option>Asia</option>
              <option>Africa</option>
              <option>Europe</option>
            </select>
            <select className="input" style={{ background: 'transparent', color: 'var(--color-text-secondary)' }}>
              <option>Sort: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div style={{ columnGap: 16 }}>
          <div style={{
            columnCount: 1,
            columnGap: 16,
          }}
            className="masonry"
          >
            {artworks.map((art) => (
              <a key={art.id} href={`/product/${art.id}`} style={{ breakInside: 'avoid', display: 'block', marginBottom: 16, textDecoration: 'none', color: 'inherit' }}>
                <div className="gold-frame" style={{ overflow: 'hidden' }}>
                  <img src={art.imageUrl} alt={art.title} style={{ width: '100%', display: 'block' }} />
                </div>
                <div style={{ padding: '8px 2px' }}>
                  <div style={{ fontWeight: 600 }}>{art.title}</div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>{art.artistName} · ${art.priceUsd.toLocaleString()}</div>
                </div>
              </a>
            ))}
            <div ref={sentinelRef} />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Explore;


