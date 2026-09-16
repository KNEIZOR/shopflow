import 'dotenv/config';

import bcrypt from 'bcryptjs';

import { prisma } from '../src/lib/prisma';

const SALT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 8;

const getRequiredEnv = (name: string): string => {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
};

const seedAdmin = async () => {
    const email = getRequiredEnv('ADMIN_EMAIL').toLowerCase();
    const password = getRequiredEnv('ADMIN_PASSWORD');

    if (password.length < MIN_PASSWORD_LENGTH) {
        throw new Error(
            `ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters long`,
        );
    }

    if (email.length === 0) {
        throw new Error('ADMIN_EMAIL cannot be empty');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        await prisma.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                password: passwordHash,
                role: 'ADMIN',
            },
        });

        console.log(`Admin user updated: ${email}`);

        return;
    }

    await prisma.user.create({
        data: {
            email,
            password: passwordHash,
            role: 'ADMIN',
        },
    });

    console.log(`Admin user created: ${email}`);
};

const main = async () => {
    try {
        await seedAdmin();
    } catch (error) {
        console.error('Failed to seed admin user:');

        console.error(error);

        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
};

void main();
