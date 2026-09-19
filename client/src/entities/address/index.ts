export {
    createAddress,
    deleteAddress,
    getAddress,
    getAddresses,
    updateAddress,
} from './api/address-api';

export { addressQueryKeys } from './model/address-query-keys';

export { useAddresses } from './model/useAddresses';

export type {
    Address,
    AddressListResponse,
    AddressResponse,
    CreateAddressInput,
    UpdateAddressInput,
} from './model/types';
