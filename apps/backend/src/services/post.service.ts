import * as repo from '../repositories/post.repo'
export const list = ()=> repo.findAll()
export const listPublic = ()=> repo.findPublic()
export const create = (data:any)=> repo.create(data)
export const remove = (id:string)=> repo.remove(id)