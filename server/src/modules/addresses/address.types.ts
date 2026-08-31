import type { CreateAddressInput, UpdateAddressInput } from './address.schema';

export type { CreateAddressInput, UpdateAddressInput };

export type AddressResponse = {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
    city: string;
    postalCode: string;
    street: string;
    apartment: string | null;
    createdAt: Date;
    updatedAt: Date;
};
