import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/database';
import { Order } from '../types/database';
import Layout from '../components/Layout';

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!orderId) {
      setError('Invalid order ID');
      setLoading(false);
      return;
    }

    fetchOrderDetails();
  }, [orderId, currentUser, navigate]);

  const fetchOrderDetails = async () => {
    if (!orderId || !currentUser) return;

    try {
      setLoading(true);
      const orderData = await orderService.getById(orderId);

      if (!orderData) {
        setError('Order not found');
        return;
      }

      // Verify that the order belongs to the current user
      if (orderData.buyerId !== currentUser.uid) {
        setError('You are not authorized to view this order');
        return;
      }

      setOrder(orderData);
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return '#10b981'; // green
      case 'processing':
        return '#f59e0b'; // yellow
      case 'shipped':
        return '#3b82f6'; // blue
      case 'delivered':
        return '#059669'; // emerald
      case 'cancelled':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔄</div>
          <h2>Loading order details...</h2>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h2>Order Not Found</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
            {error || 'The order you are looking for could not be found.'}
          </p>
          <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>
            View All Orders
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
          <h1 style={{ color: 'var(--color-gold)', marginBottom: '8px' }}>
            Order Confirmed!
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '18px' }}>
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'start', marginBottom: '24px' }}>
            <div>
              <h2 style={{ marginBottom: '8px' }}>Order #{order.id.slice(-8).toUpperCase()}</h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                Placed on {formatDate(order.createdAt)}
              </p>

              {/* Order Status */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: `${getStatusColor(order.status)}20`,
                border: `1px solid ${getStatusColor(order.status)}40`,
                borderRadius: '8px',
                color: getStatusColor(order.status),
                fontWeight: 'bold'
              }}>
                <span>{getStatusIcon(order.status)}</span>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>

            {/* Total Amount */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '4px' }}>
                Total Amount
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-gold)' }}>
                ${order.total.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '12px', color: 'var(--color-text-primary)' }}>Shipping Address</h3>
            <div className="gold-frame" style={{ padding: '16px', background: 'rgba(212,175,55,0.05)' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{order.shippingAddress.name}</div>
              <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                {order.shippingAddress.addressLine1}<br />
                {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </div>
              {order.shippingAddress.phone && (
                <div style={{ marginTop: '8px', color: 'var(--color-text-secondary)' }}>
                  📞 {order.shippingAddress.phone}
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 style={{ marginBottom: '16px', color: 'var(--color-text-primary)' }}>Order Items</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="gold-frame"
                  style={{
                    padding: '16px',
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr auto auto',
                    gap: '16px',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={item.productImage}
                    alt={item.productTitle}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                  <div>
                    <Link
                      to={`/product/${item.productId}`}
                      style={{
                        fontWeight: 'bold',
                        color: 'var(--color-text-primary)',
                        textDecoration: 'none',
                        fontSize: '16px'
                      }}
                    >
                      {item.productTitle}
                    </Link>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                      by {item.artistName}
                    </div>
                    <div style={{ fontSize: '14px', marginTop: '4px' }}>
                      ${item.unitPrice.toFixed(2)} each
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>Quantity</div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{item.quantity}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '16px' }}>
                    ${item.totalPrice.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Payment Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '4px' }}>
                Payment Method
              </div>
              <div style={{ fontWeight: 'bold' }}>
                {order.paymentMethod === 'upi' ? 'UPI Payment' : order.paymentMethod.toUpperCase()}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px', marginBottom: '4px' }}>
                Payment Status
              </div>
              <div style={{
                color: order.paymentStatus === 'paid' ? '#10b981' : '#f59e0b',
                fontWeight: 'bold'
              }}>
                {order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
              </div>
            </div>
          </div>

          {order.paymentId && (
            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(212,175,55,0.1)', borderRadius: '8px' }}>
              <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                Payment ID: {order.paymentId}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '16px' }}>Order Summary</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping</span>
              <span>${order.shipping.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '8px', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
                <span>Total</span>
                <span style={{ color: 'var(--color-gold)' }}>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '16px' }}>What's Next?</h3>
          <div style={{ display: 'grid', gap: '12px', color: 'var(--color-text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>📧</span>
              <span>You'll receive an email confirmation shortly with your order details.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>🎨</span>
              <span>Our artisans will carefully prepare your items for shipment.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>📦</span>
              <span>You'll receive tracking information once your order ships.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>🏠</span>
              <span>Your beautiful artwork will arrive within 5-7 business days.</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>
            View All Orders
          </Link>
          <Link to="/explore" className="btn-ghost" style={{ textDecoration: 'none' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;