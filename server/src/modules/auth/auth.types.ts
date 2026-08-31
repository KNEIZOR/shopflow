export type PublicUser = {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: 'USER' | 'ADMIN';
    createdAt: Date;
    updatedAt: Date;
};
