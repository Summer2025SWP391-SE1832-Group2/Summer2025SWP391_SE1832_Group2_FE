export type TransactionStatus = 'Đã thanh toán' | 'Chưa thanh toán';

export type PaymentGateway = 'PayOS' | 'VNPay' | 'Momo' | 'ZaloPay';

export interface Transaction {
  transactionId: number;
  bookingId: number;
  description: string;
  price: number;
  userId: number;
  orderCode: string;
  transactionCode: string;
  paymentGateway: PaymentGateway;
  status: TransactionStatus;
  paymentMethod: string | null;
  paymentUrl: string;
  createdAt: string;
  updatedAt: string;
}
export interface TransactionSummary {
  totalPaidAmount: number;
  totalRefundedAmount: number;
  totalSuccessfulTransactions: number;
  totalRefundedTransactions: number;
}
export interface TransactionChartData {
  label: string;
  total: number;
}