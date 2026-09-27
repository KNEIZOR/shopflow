import { useMemo, useState } from 'react';

import type {
    AdminOrderSort,
    AdminOrderStatus,
    AdminOrdersQuery,
    AdminPaymentStatus,
} from './admin-orders.types';

interface UseAdminOrdersFiltersResult {
    search: string;
    status: AdminOrderStatus | '';
    paymentStatus: AdminPaymentStatus | '';
    sort: AdminOrderSort;
    page: number;

    query: AdminOrdersQuery;

    setSearch: (value: string) => void;
    setStatus: (value: AdminOrderStatus | '') => void;
    setPaymentStatus: (value: AdminPaymentStatus | '') => void;
    setSort: (value: AdminOrderSort) => void;
    setPage: (value: number | ((currentPage: number) => number)) => void;
}

export const useAdminOrdersFilters = (): UseAdminOrdersFiltersResult => {
    const [search, setSearchState] = useState('');
    const [status, setStatusState] = useState<AdminOrderStatus | ''>('');
    const [paymentStatus, setPaymentStatusState] = useState<
        AdminPaymentStatus | ''
    >('');
    const [sort, setSortState] = useState<AdminOrderSort>('newest');
    const [page, setPageState] = useState(1);

    const setSearch = (value: string) => {
        setSearchState(value);
        setPageState(1);
    };

    const setStatus = (value: AdminOrderStatus | '') => {
        setStatusState(value);
        setPageState(1);
    };

    const setPaymentStatus = (value: AdminPaymentStatus | '') => {
        setPaymentStatusState(value);
        setPageState(1);
    };

    const setSort = (value: AdminOrderSort) => {
        setSortState(value);
        setPageState(1);
    };

    const setPage = (value: number | ((currentPage: number) => number)) => {
        setPageState(value);
    };

    const query = useMemo<AdminOrdersQuery>(
        () => ({
            page,
            limit: 10,
            search: search.trim() || undefined,
            status: status || undefined,
            paymentStatus: paymentStatus || undefined,
            sort,
        }),
        [page, search, status, paymentStatus, sort],
    );

    return {
        search,
        status,
        paymentStatus,
        sort,
        page,
        query,
        setSearch,
        setStatus,
        setPaymentStatus,
        setSort,
        setPage,
    };
};
