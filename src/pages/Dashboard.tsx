import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductForm from '../components/ProductForm';
import { useAuth } from '../context/AuthContext';
import { productService, orderService } from '../services/database';
import { Product, Order } from '../types/database';

type DashboardView = 'overview' | 'products' | 'create-product' | 'edit-product' | 'orders' | 'profile';

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Load artisan's products
  useEffect(() => {
    if (userProfile?.userType === 'artisan') {
      loadProducts();
    }
  }, [userProfile]);

  // Load orders when orders view is selected
  useEffect(() => {
    if (currentView === 'orders' && userProfile) {
      loadOrders();
    }
  }, [currentView, userProfile]);

  const loadProducts = async () => {
    if (!userProfile) return;
    setLoading(true);
    try {
      const artistProducts = await productService.getByArtist(userProfile.uid);
      setProducts(artistProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    if (!userProfile) return;
    setOrdersLoading(true);
    try {
      let userOrders: Order[] = [];
      if (userProfile.userType === 'artisan') {
        // For artisans, get orders containing their products
        userOrders = await orderService.getByArtist(userProfile.uid);
      } else {
        // For buyers, get their purchase orders
        userOrders = await orderService.getByBuyer(userProfile.uid);
      }
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleProductSuccess = () => {
    setCurrentView('products');
    setEditingProductId(null);
    loadProducts();
  };
  const handleEditProduct = (productId: string) => {
    setEditingProductId(productId);
    setCurrentView('edit-product');
  };

  const renderSidebar = () => (
    <aside className="glass-panel" style={{ borderRadius: 12, padding: 12, height: 'fit-content' }}>
      <button
        onClick={() => setCurrentView('overview')}
        style={{
          display: 'block',
          width: '100%',
          padding: 8,
          textAlign: 'left',
          background: currentView === 'overview' ? 'rgba(212,175,55,0.2)' : 'transparent',
          border: 'none',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          borderRadius: 4
        }}
      >
        Dashboard
      </button>
      <button
        onClick={() => setCurrentView('products')}
        style={{
          display: 'block',
          width: '100%',
          padding: 8,
          textAlign: 'left',
          background: currentView === 'products' ? 'rgba(212,175,55,0.2)' : 'transparent',
          border: 'none',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          borderRadius: 4
        }}
      >
        My Crafts
      </button>
      <button
        onClick={() => setCurrentView('orders')}
        style={{
          display: 'block',
          width: '100%',
          padding: 8,
          textAlign: 'left',
          background: currentView === 'orders' ? 'rgba(212,175,55,0.2)' : 'transparent',
          border: 'none',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          borderRadius: 4
        }}
      >
        Orders
      </button>
      <button
        onClick={() => setCurrentView('profile')}
        style={{
          display: 'block',
          width: '100%',
          padding: 8,
          textAlign: 'left',
          background: currentView === 'profile' ? 'rgba(212,175,55,0.2)' : 'transparent',
          border: 'none',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          borderRadius: 4
        }}
      >
        Profile Settings
      </button>
    </aside>
  );

  const renderOverview = () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <div className="glass-panel" style={{ borderRadius: 12, padding: 16 }}>
        <h2>Welcome back, {userProfile?.name}!</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {userProfile?.userType === 'artisan'
            ? 'Manage your crafts, track orders, and grow your artisan business.'
            : 'Discover amazing crafts and connect with talented artisans.'
          }
        </p>
      </div>

      {userProfile?.userType === 'artisan' && (
        <div className="glass-panel" style={{ borderRadius: 12, padding: 16 }}>
          <h2>Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div className="gold-frame" style={{ padding: 12 }}>
              <div style={{ color: 'var(--color-text-secondary)' }}>Total Products</div>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>{products.length}</div>
            </div>
            <div className="gold-frame" style={{ padding: 12 }}>
              <div style={{ color: 'var(--color-text-secondary)' }}>Active Listings</div>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                {products.filter(p => p.status === 'active').length}
              </div>
            </div>
            <div className="gold-frame" style={{ padding: 12 }}>
              <div style={{ color: 'var(--color-text-secondary)' }}>Draft Products</div>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                {products.filter(p => p.status === 'draft').length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderOrders = () => {
    const getStatusColor = (status: Order['status']) => {
      switch (status) {
        case 'confirmed':
          return '#10b981';
        case 'processing':
          return '#f59e0b';
        case 'shipped':
          return '#3b82f6';
        case 'delivered':
          return '#059669';
        case 'cancelled':
          return '#ef4444';
        default:
          return '#6b7280';
      }
    };

    const getStatusIcon = (status: Order['status']) => {
      switch (status) {
        case 'confirmed':
          return '✅';
        case 'processing':
          return '⏳';
        case 'shipped':
          return '🚚';
        case 'delivered':
          return '📦';
        case 'cancelled':
          return '❌';
        default:
          return '📋';
      }
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    return (
      <div className="glass-panel" style={{ borderRadius: 12, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2>{userProfile?.userType === 'artisan' ? 'Orders for My Products' : 'My Orders'}</h2>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </div>
        </div>

        {ordersLoading && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: '24px', marginBottom: 16 }}>⏳</div>
            <p>Loading orders...</p>
          </div>
        )}

        {!ordersLoading && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: '48px', marginBottom: 16 }}>📦</div>
            <h3 style={{ marginBottom: 8 }}>No orders yet</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {userProfile?.userType === 'artisan'
                ? 'Orders for your products will appear here'
                : 'Your purchase orders will appear here'
              }
            </p>
          </div>
        )}

        {!ordersLoading && orders.length > 0 && (
          <div style={{ display: 'grid', gap: 16 }}>
            {orders.map((order) => (
              <div
                key={order.id}
                className="gold-frame"
                style={{
                  padding: 16,
                  borderRadius: 8,
                  background: 'rgba(212,175,55,0.05)'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
                  <div>
                    {/* Order Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <h4 style={{ margin: 0 }}>
                        Order #{order.orderNumber || order.id.slice(-8).toUpperCase()}
                      </h4>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 8px',
                        background: `${getStatusColor(order.status)}20`,
                        border: `1px solid ${getStatusColor(order.status)}40`,
                        borderRadius: 6,
                        color: getStatusColor(order.status),
                        fontSize: 12,
                        fontWeight: 'bold'
                      }}>
                        <span>{getStatusIcon(order.status)}</span>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>

                    {/* Customer/Artisan Info */}
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 8 }}>
                      {userProfile?.userType === 'artisan' ? (
                        <>Customer: {order.buyerName} ({order.buyerEmail})</>
                      ) : (
                        <>Order Date: {formatDate(order.createdAt)}</>
                      )}
                    </div>

                    {/* Order Items Summary */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                        Items ({order.items.length}):
                      </div>
                      <div style={{ display: 'grid', gap: 6 }}>
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <img
                              src={item.productImage}
                              alt={item.productTitle}
                              style={{
                                width: 32,
                                height: 32,
                                objectFit: 'cover',
                                borderRadius: 4
                              }}
                            />
                            <span style={{ fontSize: 14 }}>
                              {item.productTitle} x{item.quantity}
                            </span>
                            <span style={{ fontSize: 14, fontWeight: 'bold', marginLeft: 'auto' }}>
                              ${item.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                            +{order.items.length - 3} more items
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address for Artisans */}
                    {userProfile?.userType === 'artisan' && (
                      <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
                        📍 {order.shippingAddress.city}, {order.shippingAddress.state}
                      </div>
                    )}
                  </div>

                  {/* Right Side - Total and Actions */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--color-gold)', marginBottom: 12 }}>
                      ${order.total.toFixed(2)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <button
                        onClick={() => window.open(`/order-confirmation/${order.id}`, '_blank')}
                        className="btn-primary"
                        style={{ fontSize: 12, padding: '6px 12px' }}
                      >
                        View Details
                      </button>
                      {userProfile?.userType === 'artisan' && order.status === 'confirmed' && (
                        <button
                          className="btn-ghost"
                          style={{ fontSize: 12, padding: '6px 12px' }}
                          onClick={() => {/* Handle status update */}}
                        >
                          Mark Processing
                        </button>
                      )}
                      {userProfile?.userType === 'artisan' && order.status === 'processing' && (
                        <button
                          className="btn-ghost"
                          style={{ fontSize: 12, padding: '6px 12px' }}
                          onClick={() => {/* Handle status update */}}
                        >
                          Mark Shipped
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderProducts = () => (
    <div className="glass-panel" style={{ borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>My Crafts</h2>
        <button
          onClick={() => setCurrentView('create-product')}
          className="btn-primary"
        >
          Add New Craft
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>Loading products...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <h3>No products yet</h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20 }}>
            Start by creating your first craft listing
          </p>
          <button
            onClick={() => setCurrentView('create-product')}
            className="btn-primary"
          >
            Create Your First Product
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
          {products.map((product) => (
            <div key={product.id} className="gold-frame" style={{ padding: 12 }}>
              <div style={{ height: 120, background: 'rgba(212,175,55,0.1)', borderRadius: 8, marginBottom: 8, display: 'grid', placeItems: 'center' }}>
                {product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                ) : (
                  <span style={{ color: 'var(--color-text-secondary)' }}>No image</span>
                )}
              </div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: 14 }}>{product.title}</h4>
              <p style={{ margin: '0 0 8px 0', fontSize: 12, color: 'var(--color-text-secondary)' }}>
                ${product.priceUsd} • {product.category}
              </p>
              <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
                <span style={{
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: product.status === 'active' ? 'rgba(0,255,0,0.2)' : 'rgba(255,165,0,0.2)'
                }}>
                  {product.status}
                </span>
                <span>Stock: {product.stock}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => handleEditProduct(product.id)}
                  className="btn-ghost"
                  style={{ fontSize: 12, padding: '4px 8px' }}
                >
                  Edit
                </button>
                <button
                  className="btn-ghost"
                  style={{ fontSize: 12, padding: '4px 8px' }}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return renderOverview();
      case 'products':
        return renderProducts();
      case 'create-product':
        return (
          <ProductForm
            onSuccess={handleProductSuccess}
            onCancel={() => setCurrentView('products')}
          />
        );
      case 'edit-product':
        return (
          <ProductForm
            productId={editingProductId || undefined}
            onSuccess={handleProductSuccess}
            onCancel={() => setCurrentView('products')}
          />
        );
      case 'orders':
        return renderOrders();
      case 'profile':
        return (
          <div className="glass-panel" style={{ borderRadius: 12, padding: 16 }}>
            <h2>Profile Settings</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>Profile management coming soon...</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  if (!userProfile) {
    return (
      <Layout>
        <section className="page-transition" style={{ padding: '16px', textAlign: 'center' }}>
          <div className="glass-panel" style={{ borderRadius: 12, padding: 40 }}>
            <h2>Please log in to access your dashboard</h2>
            <a href="/login" className="btn-primary">Login</a>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="page-transition" style={{ padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 16 }}>
          {renderSidebar()}
          <div>{renderContent()}</div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;


