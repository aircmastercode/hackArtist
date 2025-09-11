import React, { createContext, useContext, useMemo, useReducer } from 'react';
import type { Artwork, CartItem } from '../types';

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: 'ADD'; artwork: Artwork; quantity?: number }
  | { type: 'REMOVE'; artworkId: string }
  | { type: 'SET_QTY'; artworkId: string; quantity: number }
  | { type: 'CLEAR' };

const initialState: CartState = { items: [] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const quantityToAdd = action.quantity ?? 1;
      const existingIndex = state.items.findIndex(i => i.artwork.id === action.artwork.id);
      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantityToAdd,
        };
        return { items: updated };
      }
      return { items: [...state.items, { artwork: action.artwork, quantity: quantityToAdd }] };
    }
    case 'REMOVE':
      return { items: state.items.filter(i => i.artwork.id !== action.artworkId) };
    case 'SET_QTY':
      return {
        items: state.items.map(i => (i.artwork.id === action.artworkId ? { ...i, quantity: action.quantity } : i)),
      };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  subtotalUsd: number;
  add: (artwork: Artwork, quantity?: number) => void;
  remove: (artworkId: string) => void;
  setQuantity: (artworkId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const subtotalUsd = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity * i.artwork.priceUsd, 0),
    [state.items]
  );
  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      subtotalUsd,
      add: (artwork, quantity) => dispatch({ type: 'ADD', artwork, quantity }),
      remove: (artworkId) => dispatch({ type: 'REMOVE', artworkId }),
      setQuantity: (artworkId, quantity) => dispatch({ type: 'SET_QTY', artworkId, quantity }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }),
    [state.items, subtotalUsd]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}


