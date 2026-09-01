const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

type ApiRequestOptions = RequestInit & {
    body?: BodyInit | null;
};

export class ApiError extends Error {
    status: number;
    code?: string;

    constructor(message: string, status: number, code?: string) {
        super(message);

        this.name = 'ApiError';
        this.status = status;
        this.code = code;
    }
}

export const apiRequest = async <T>(
    endpoint: string,
    options: ApiRequestOptions = {},
): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,

        credentials: 'include',

        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new ApiError(
            data?.message ?? 'Request failed',
            response.status,
            data?.code,
        );
    }

    return data as T;
};
