import { PrismaClient } from '@prisma/client';
import { hash } from '../src/utils/hash';
const prisma = new PrismaClient();
async function main() {
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) {
        await prisma.user.create({ data: { email, password: await hash(password), name: 'Admin' } });
        console.log('Seeded admin:', email);
    }
    else {
        console.log('Admin exists:', email);
    }
}
main().finally(() => prisma.$disconnect());
