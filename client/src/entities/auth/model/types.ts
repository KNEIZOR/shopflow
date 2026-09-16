export type UserRole = 'USER' | 'ADMIN';

export type AuthUser = {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
};

export type LoginInput = {
    email: string;
    password: string;
};

export type LoginResponse = {
    success: boolean;
    user: AuthUser;
};

export type MeResponse = {
    success: boolean;
    user: AuthUser;
};

export type LogoutResponse = {
    success: boolean;
    message: string;
};
