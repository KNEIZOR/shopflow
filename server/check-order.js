require('dotenv').config();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const order = await prisma.order.findUnique({
        where: {
            id: 'cmthgmmmq0011tjo0b44vj4vu',
        },
        select: {
            id: true,
            paymentSessionId: true,
            paymentIntentId: true,
            status: true,
            paymentStatus: true,
        },
    });

    console.log(JSON.stringify(order, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
