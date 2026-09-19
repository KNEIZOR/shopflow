export type Address = {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
    city: string;
    postalCode: string;
    street: string;
    apartment: string | null;
    createdAt: string;
    updatedAt: string;
};

export type AddressListResponse = {
    success: boolean;
    data: Address[];
};

export type AddressResponse = {
    success: boolean;
    data: Address;
};

export type CreateAddressInput = {
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
    city: string;
    postalCode: string;
    street: string;
    apartment?: string;
};

export type UpdateAddressInput = Partial<CreateAddressInput>;
