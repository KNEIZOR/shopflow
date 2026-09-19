import { apiRequest } from '@/shared/api';

import type {
    Address,
    AddressListResponse,
    AddressResponse,
    CreateAddressInput,
    UpdateAddressInput,
} from '../model/types';

export const getAddresses = async (): Promise<Address[]> => {
    const response = await apiRequest<AddressListResponse>('/addresses');

    return response.data;
};

export const getAddress = async (addressId: string): Promise<Address> => {
    const response = await apiRequest<AddressResponse>(
        `/addresses/${addressId}`,
    );

    return response.data;
};

export const createAddress = async (
    input: CreateAddressInput,
): Promise<Address> => {
    const response = await apiRequest<AddressResponse>('/addresses', {
        method: 'POST',
        body: JSON.stringify(input),
    });

    return response.data;
};

export const updateAddress = async (
    addressId: string,
    input: UpdateAddressInput,
): Promise<Address> => {
    const response = await apiRequest<AddressResponse>(
        `/addresses/${addressId}`,
        {
            method: 'PATCH',
            body: JSON.stringify(input),
        },
    );

    return response.data;
};

export const deleteAddress = async (addressId: string): Promise<void> => {
    await apiRequest<void>(`/addresses/${addressId}`, {
        method: 'DELETE',
    });
};
