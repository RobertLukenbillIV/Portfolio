import * as svc from '../services/post.service'
import { Request, Response } from 'express'
import { prisma } from '../lib/db'

export async function list(_req:Request,res:Response){ res.json(await svc.list()) }
export async function listPublic(_req:Request,res:Response){ res.json(await svc.listPublic()) }
export async function create(req:Request,res:Response){
const user=(req as any).user
const created = await svc.create({...req.body, authorId:user.id})
res.status(201).json(created)
}
export async function remove(req:Request,res:Response){ await svc.remove(req.params.id); res.status(204).end() }
export async function setFeatured(req: Request, res: Response) {
  const { id } = req.params
  const { featured } = req.body as { featured: boolean }
  const post = await prisma.post.update({ where: { id }, data: { featured: !!featured } })
  res.json({ post })
}
export async function listFeatured(req: Request, res: Response) {
  const limit = Math.min(Number(req.query.limit ?? 3), 6)
  const posts = await prisma.post.findMany({
    where: { published: true, featured: true },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    select: { id: true, title: true, excerpt: true, coverUrl: true, updatedAt: true },
  })
  res.json({ posts })
}