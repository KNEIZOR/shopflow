import type { CreateOrderInput } from './order.schema';

export type { CreateOrderInput };

export type CreateOrderResult = {
    id: string;
    total: string;
    status: string;
    paymentStatus: string;
};
