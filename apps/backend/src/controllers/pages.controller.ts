import { Request, Response } from 'express'
import { prisma } from '../lib/db'

export async function getPage(req: Request, res: Response) {
  const { slug } = req.params
  const page = await prisma.page.findUnique({ where: { slug } })
  if (!page) return res.status(404).json({ message: 'Page not found' })
  res.json({ page })
}

export async function upsertPage(req: Request, res: Response) {
  const { slug } = req.params
  const { title, content } = req.body
  const page = await prisma.page.upsert({
    where: { slug },
    update: { title, content },
    create: { slug, title: title || slug, content: content || '' },
  })
  res.json({ page })
}
