import React from 'react';
import Layout from '../components/Layout';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section style={{ padding: '40px 0' }}>
    <h2 style={{ marginBottom: 8 }}>{title}</h2>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center' }}>
      <div style={{ color: 'var(--color-text-secondary)' }}>{children}</div>
      <div className="gold-frame" style={{ height: 220 }} />
    </div>
  </section>
);

const About: React.FC = () => {
  return (
    <Layout>
      <div className="page-transition" style={{ padding: '40px 24px' }}>
        <Section title="Our Vision">A living, digital gallery where craft is alive and stories are tangible.</Section>
        <Section title="Preserving Heritage">We celebrate the legacy of craft and ensure artisans thrive in the modern era.</Section>
        <Section title="Meet the Team">Curators, designers, engineers—all united in devotion to artistry.</Section>
      </div>
    </Layout>
  );
};

export default About;


