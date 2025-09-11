import React from 'react';
import { useCart } from '../context/CartContext';

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { items, subtotalUsd, remove, setQuantity, clear } = useCart();
  return (
    <>
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 90 }} />}
      <aside
        className="glass-panel"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 380,
          transform: open ? 'translateX(0)' : 'translateX(110%)',
          transition: 'transform 200ms ease-out',
          zIndex: 100,
          padding: 16,
        }}
      >
        <h2>Cart</h2>
        <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
          {items.length === 0 && <div style={{ color: 'var(--color-text-secondary)' }}>Your cart is empty.</div>}
          {items.map(({ artwork, quantity }) => (
            <div key={artwork.id} className="gold-frame" style={{ padding: 8, display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: 10, alignItems: 'center' }}>
              <img src={artwork.imageUrl} alt={artwork.title} style={{ width: 56, height: 56, objectFit: 'cover' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{artwork.title}</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>{artwork.artistName}</div>
                <div style={{ fontSize: 12 }}>${artwork.priceUsd.toLocaleString()}</div>
              </div>
              <div style={{ display: 'grid', gap: 6, justifyItems: 'end' }}>
                <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(artwork.id, Number(e.target.value))} className="input" style={{ width: 64 }} />
                <button className="btn-ghost" onClick={() => remove(artwork.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0' }}>
            <span>Subtotal</span>
            <strong>${subtotalUsd.toFixed(2)}</strong>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" onClick={clear}>Clear</button>
            <button className="btn-primary" style={{ flex: 1 }}>Proceed to Checkout</button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;


