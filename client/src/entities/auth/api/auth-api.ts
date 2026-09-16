import { apiRequest } from '@/shared/api';

import type {
    LoginInput,
    LoginResponse,
    LogoutResponse,
    MeResponse,
} from '../model/types';

export const login = async (
    input: LoginInput,
): Promise<LoginResponse['user']> => {
    const response = await apiRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(input),
    });

    return response.user;
};

export const logout = async (): Promise<void> => {
    await apiRequest<LogoutResponse>('/auth/logout', {
        method: 'POST',
    });
};

export const getCurrentUser = async () => {
    const response = await apiRequest<MeResponse>('/auth/me');

    return response.user;
};
