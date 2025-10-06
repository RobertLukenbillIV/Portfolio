import { Request, Response } from 'express'
import { prisma } from '../lib/db'

export async function getSettings(_req: Request, res: Response) {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } })
  res.json({ settings })
}

export async function updateSettings(req: Request, res: Response) {
  const { homeHeroUrl, homeIntro } = req.body
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: { homeHeroUrl, homeIntro },
    create: { id: 1, homeHeroUrl, homeIntro },
  })
  res.json({ settings })
}
