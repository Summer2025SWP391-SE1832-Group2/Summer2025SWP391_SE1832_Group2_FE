type Shipping = {
    shippingId: number;
    receiver: string;
    address: string;
    shipperId: number | null;
    status: string;
    createAt: string;
    updateAt: string | null;
    bookingId: number;
  }
  export type { Shipping };