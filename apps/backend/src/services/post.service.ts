// Post service layer - contains business logic for post operations
// Acts as intermediary between controllers and repositories
// Connected to: controllers/post.controller.ts, repositories/post.repo.ts

import * as repo from '../repositories/post.repo'    // Data access layer

// Business logic for listing all posts (admin view)
// Currently passes through to repository, but could add filtering/sorting logic
export const list = ()=> repo.findAll()

// Business logic for listing public posts (visitor view)
// Currently passes through to repository, but could add caching/analytics
export const listPublic = ()=> repo.findPublic()

// Business logic for creating posts
// Could add validation, content processing, or notification logic here
export const create = (data:any)=> repo.create(data)

// Business logic for updating posts
// Could add validation, change tracking, or notification logic here
export const update = (id:string, data:any)=> repo.update(id, data)

// Business logic for getting individual post (public access)
// Could add view tracking, related posts, or content enrichment here
export const getById = (id:string)=> repo.findByIdPublic(id)

// Business logic for getting individual post (admin access)
// Could add edit permissions checking or draft management here
export const getByIdAdmin = (id:string)=> repo.findById(id)

// Business logic for removing posts
// Could add soft delete, audit logging, or cleanup logic here
export const remove = (id:string)=> repo.remove(id)