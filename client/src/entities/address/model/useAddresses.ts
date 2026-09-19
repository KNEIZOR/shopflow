import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/entities/auth';

import { getAddresses } from '../api/address-api';

import { addressQueryKeys } from './address-query-keys';

export const useAddresses = () => {
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    return useQuery({
        queryKey: addressQueryKeys.list(),

        queryFn: getAddresses,

        enabled: isAuthenticated && !isAuthLoading,

        staleTime: 60 * 1000,

        retry: false,
    });
};
