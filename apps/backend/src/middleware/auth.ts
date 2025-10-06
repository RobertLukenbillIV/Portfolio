import { Request, Response, NextFunction } from 'express'
import { verify } from '../utils/jwt'
export function requireAuth(req:Request,res:Response,next:NextFunction){
const token = req.cookies['token']
try{ const user = token? verify(token): null; if(!user) return res.status(401).json({message:'Unauthorized'})
;(req as any).user = user; next()
}catch{ return res.status(401).json({message:'Unauthorized'}) }
}