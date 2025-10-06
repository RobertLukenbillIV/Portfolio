import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const findAll = () => prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
export const findPublic = () => prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } });
export const create = (data) => prisma.post.create({ data });
export const remove = (id) => prisma.post.delete({ where: { id } });
