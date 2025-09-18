import React, { useState } from 'react';
import { seedDatabase } from '../utils/seedData';

const DataSeeder: React.FC = () => {
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    setSeeding(true);
    setError(null);
    try {
      await seedDatabase();
      setSeeded(true);
      console.log('✅ Database seeded successfully! Refresh the page to see products.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed database');
      console.error('❌ Seeding failed:', err);
    } finally {
      setSeeding(false);
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: 16,
      borderRadius: 8,
      zIndex: 1000,
      maxWidth: 300
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: 14 }}>🛠️ Development Tools</h4>

      {!seeded && !seeding && (
        <button
          onClick={handleSeed}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12
          }}
        >
          🌱 Seed Sample Data
        </button>
      )}

      {seeding && (
        <div style={{ fontSize: 12 }}>
          <div>🔄 Seeding database...</div>
          <div style={{ fontSize: 10, opacity: 0.7 }}>Check console for progress</div>
        </div>
      )}

      {seeded && (
        <div style={{ fontSize: 12, color: '#4CAF50' }}>
          ✅ Database seeded!
          <div style={{ fontSize: 10, opacity: 0.7 }}>Refresh to see products</div>
        </div>
      )}

      {error && (
        <div style={{ fontSize: 12, color: '#f44336' }}>
          ❌ Error: {error}
        </div>
      )}
    </div>
  );
};

export default DataSeeder;