import { Request, Response } from 'express'
import * as svc from '../services/post.service'
export async function list(_req:Request,res:Response){ res.json(await svc.list()) }
export async function listPublic(_req:Request,res:Response){ res.json(await svc.listPublic()) }
export async function create(req:Request,res:Response){
const user=(req as any).user
const created = await svc.create({...req.body, authorId:user.id})
res.status(201).json(created)
}
export async function remove(req:Request,res:Response){ await svc.remove(req.params.id); res.status(204).end() }