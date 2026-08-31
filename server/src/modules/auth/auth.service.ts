import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { prisma } from '../../lib/prisma';
import { env } from '../../config/env';
import { AppError } from '../../errors/app-error';

import type { LoginInput, RegisterInput } from './auth.schema';
import type { PublicUser } from './auth.types';

const SALT_ROUNDS = 12;

const sanitizeUser = (user: {
    id: string;
    email: string;
    password: string;
    firstName: string | null;
    lastName: string | null;
    role: 'USER' | 'ADMIN';
    createdAt: Date;
    updatedAt: Date;
}): PublicUser => {
    const { password: _password, ...publicUser } = user;

    return publicUser;
};

const createToken = (userId: string) => {
    return jwt.sign({ userId }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
};

export const register = async (
    input: RegisterInput,
): Promise<{ user: PublicUser; token: string }> => {
    const email = input.email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new AppError(
            409,
            'USER_ALREADY_EXISTS',
            'User with this email already exists',
        );
    }

    const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName: input.firstName,
            lastName: input.lastName,
        },
    });

    const token = createToken(user.id);

    return {
        user: sanitizeUser(user),
        token,
    };
};

export const login = async (
    input: LoginInput,
): Promise<{ user: PublicUser; token: string }> => {
    const email = input.email.toLowerCase();

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new AppError(
            401,
            'INVALID_CREDENTIALS',
            'Invalid email or password',
        );
    }

    const passwordMatches = await bcrypt.compare(input.password, user.password);

    if (!passwordMatches) {
        throw new AppError(
            401,
            'INVALID_CREDENTIALS',
            'Invalid email or password',
        );
    }

    const token = createToken(user.id);

    return {
        user: sanitizeUser(user),
        token,
    };
};

export const getUserById = async (
    userId: string,
): Promise<PublicUser | null> => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        return null;
    }

    return sanitizeUser(user);
};
