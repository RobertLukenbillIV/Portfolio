 import { PrismaClient } from '@prisma/client'
 const prisma = new PrismaClient()
 export const findByEmail = (email:string)=> prisma.user.findUnique({ where:{ email } })
 export const createAdmin = (email:string, password:string, name?:string)=> prisma.user.create({ data:{ email, password, name } })
export const findById = (id:string)=>
  prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, role: true, name: true }
})
