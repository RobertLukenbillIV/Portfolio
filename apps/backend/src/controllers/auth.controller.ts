 import { Request, Response } from 'express'
import { sign, verify } from '../utils/jwt.js'
import { findByEmail, findById } from '../repositories/user.repo.js'
 import { compare } from '../utils/hash.js'

 export async function login(req:Request,res:Response){
   const {email,password}=req.body
   const user = await findByEmail(email)
   if(!user) return res.status(401).json({message:'Invalid credentials'})
   const ok = await compare(password, user.password)
   if(!ok) return res.status(401).json({message:'Invalid credentials'})
   const token = sign({ id:user.id, email:user.email, role:user.role })
   // wherever you set the cookie on login:
const isProd = process.env.NODE_ENV === 'production'
res.cookie('token', token, {
  httpOnly: true,
  secure: isProd,           // required for SameSite=None
  sameSite: isProd ? 'none' : 'lax',
  maxAge: 7 * 24 * 3600 * 1000,
})

   return res.json({message:'ok'})
 }

export async function me(req:Request,res:Response){
  try{
    const token = req.cookies['token']
    if(!token) return res.status(401).json({message:'Unauthorized'})
    const payload = verify(token) as any
    const user = await findById(payload.id)
    if(!user) return res.status(401).json({message:'Unauthorized'})
    return res.json({ id:user.id, email:user.email, role:user.role, name:user.name || null })
  }catch{
    return res.status(401).json({message:'Unauthorized'})
  }
}
 export async function logout(_req:Request,res:Response){ res.clearCookie('token'); return res.json({ok:true}) }
