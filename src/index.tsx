import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CartProvider } from './context/CartContext';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}
const root = ReactDOM.createRoot(container as HTMLElement);
root.render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);

// Ensure no stale service workers control the page (avoids showing old builds)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister());
  });
}


