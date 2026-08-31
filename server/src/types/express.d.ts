declare global {
    namespace Express {
        interface User {
            id: string;
            email: string;
            role: 'USER' | 'ADMIN';
        }

        interface Request {
            userId?: string;
            user?: User;
        }
    }
}

export {};
