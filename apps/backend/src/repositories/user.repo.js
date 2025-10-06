import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const findByEmail = (email) => prisma.user.findUnique({ where: { email } });
export const createAdmin = (email, password, name) => prisma.user.create({ data: { email, password, name } });
export const findById = (id) => prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, role: true, name: true }
});
