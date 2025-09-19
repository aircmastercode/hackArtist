// Razorpay Integration Service
// This service handles payment processing through Razorpay API
// All actual API calls should be made from your backend for security

interface RazorpayConfig {
  key_id: string;
  key_secret: string;
}

interface CreateQRCodePayload {
  type: 'upi_qr';
  usage: 'single_use' | 'multiple_use';
  fixed_amount: boolean;
  payment_amount: number; // Amount in paise (multiply by 100)
  description: string;
  customer_id?: string;
  close_by?: number; // Unix timestamp
}

interface QRCodeResponse {
  id: string;
  entity: 'qr_code';
  created_at: number;
  type: 'upi_qr';
  usage: 'single_use' | 'multiple_use';
  fixed_amount: boolean;
  payment_amount: number;
  status: 'active' | 'inactive' | 'closed';
  description: string;
  short_url: string;
  customer_id?: string;
  close_by?: number;
  closed_at?: number;
  image_url: string; // This is the QR code image URL
  payments_count_received: number;
  payments_amount_received: number;
}

interface PaymentStatusResponse {
  id: string;
  entity: 'payment';
  amount: number;
  currency: 'INR';
  status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed';
  order_id?: string;
  description: string;
  method: 'upi';
  vpa?: string; // UPI ID used for payment
  created_at: number;
}

class RazorpayService {
  private config: RazorpayConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      key_id: process.env.REACT_APP_RAZORPAY_KEY_ID || '',
      key_secret: process.env.REACT_APP_RAZORPAY_KEY_SECRET || ''
    };
    
    // Backend API endpoint for Razorpay operations
    this.baseUrl = process.env.REACT_APP_API_BASE_URL || '/api/razorpay';
  }

  // Generate UPI QR Code for payment
  async createQRCode(payload: CreateQRCodePayload): Promise<QRCodeResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/qr-codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to create QR code: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating QR code:', error);
      throw error;
    }
  }

  // Check payment status for a QR code
  async getQRCodeStatus(qrCodeId: string): Promise<QRCodeResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/qr-codes/${qrCodeId}/status`);

      if (!response.ok) {
        throw new Error(`Failed to get QR code status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting QR code status:', error);
      throw error;
    }
  }

  // Get payments made to a QR code
  async getQRCodePayments(qrCodeId: string): Promise<PaymentStatusResponse[]> {
    try {
      const response = await fetch(`${this.baseUrl}/qr-codes/${qrCodeId}/payments`);

      if (!response.ok) {
        throw new Error(`Failed to get QR code payments: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting QR code payments:', error);
      throw error;
    }
  }

  // Convert rupees to paise (Razorpay uses paise)
  convertToPaise(rupees: number): number {
    return Math.round(rupees * 100);
  }

  // Convert paise to rupees
  convertToRupees(paise: number): number {
    return paise / 100;
  }

  // Validate webhook signature (for production)
  validateWebhookSignature(payload: string, signature: string, secret: string): boolean {
    // This should be implemented on the backend for security
    // Frontend should not handle webhook validation
    console.warn('Webhook validation should be handled on the backend');
    return false;
  }
}

export const razorpayService = new RazorpayService();
export type { QRCodeResponse, PaymentStatusResponse, CreateQRCodePayload };