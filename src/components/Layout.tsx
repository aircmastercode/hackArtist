import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartDrawer from './CartDrawer';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { items, subtotalUsd } = useCart();
  const { currentUser, userProfile, logout } = useAuth();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <div>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '14px 24px' }}>
          <Link to="/" style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--color-text-primary)', textDecoration: 'none' }}>
            Aureum Market
          </Link>
          <nav style={{ display: 'flex', gap: 16 }}>
            <NavLink to="/explore" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Explore</NavLink>
            <NavLink to="/about" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>About</NavLink>
            <NavLink to="/contact" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>Contact</NavLink>
          </nav>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            {currentUser ? (
              <>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  Welcome, {userProfile?.name || currentUser.displayName || 'User'}
                </span>
                <NavLink to="/dashboard" className="btn-ghost">Dashboard</NavLink>
                <button onClick={handleLogout} className="btn-ghost">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn-ghost">Login</NavLink>
                <NavLink to="/signup" className="btn-primary">Join as an Artist</NavLink>
              </>
            )}
            <button onClick={() => setOpen(true)} className="btn-ghost" style={{ borderColor: 'rgba(212,175,55,0.4)' }}>
              Cart ({itemCount}) · ${subtotalUsd.toFixed(2)}
            </button>
          </div>
        </div>
      </header>
      <main style={{ paddingTop: 76 }}>{children}</main>
      <footer style={{ padding: '40px 24px', color: 'var(--color-text-secondary)' }}>
        © {new Date().getFullYear()} Aureum Market — Where Heritage Meets the Horizon.
      </footer>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default Layout;


