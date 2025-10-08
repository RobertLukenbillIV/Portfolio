// Tests for post service layer
import * as postService from '../post.service'
import * as postRepo from '../../repositories/post.repo'

// Mock the post repository
jest.mock('../../repositories/post.repo', () => ({
  findAll: jest.fn(),
  findPublic: jest.fn(),
  create: jest.fn(),
  findByIdPublic: jest.fn(),
  findById: jest.fn(),
  remove: jest.fn(),
}))

const mockPostRepo = postRepo as jest.Mocked<typeof postRepo>

describe('Post Service', () => {
  const mockPosts = [
    {
      id: 'post-1',
      title: 'Test Post 1',
      excerpt: 'Test excerpt 1',
      content: 'Test content 1',
      coverUrl: null,
      authorId: 'author-1',
      published: true,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'post-2',
      title: 'Test Post 2',
      excerpt: 'Test excerpt 2',
      content: 'Test content 2',
      coverUrl: 'https://example.com/cover.jpg',
      authorId: 'author-1',
      published: false,
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const mockPost = mockPosts[0]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('list', () => {
    it('should call repository findAll and return all posts', async () => {
      mockPostRepo.findAll.mockResolvedValue(mockPosts)

      const result = await postService.list()

      expect(mockPostRepo.findAll).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockPosts)
    })

    it('should handle repository errors', async () => {
      const error = new Error('Database error')
      mockPostRepo.findAll.mockRejectedValue(error)

      await expect(postService.list()).rejects.toThrow('Database error')
    })
  })

  describe('listPublic', () => {
    it('should call repository findPublic and return public posts', async () => {
      const publicPosts = mockPosts.filter(p => p.published)
      mockPostRepo.findPublic.mockResolvedValue(publicPosts)

      const result = await postService.listPublic()

      expect(mockPostRepo.findPublic).toHaveBeenCalledTimes(1)
      expect(result).toEqual(publicPosts)
    })

    it('should handle repository errors', async () => {
      const error = new Error('Database error')
      mockPostRepo.findPublic.mockRejectedValue(error)

      await expect(postService.listPublic()).rejects.toThrow('Database error')
    })
  })

  describe('create', () => {
    it('should call repository create with provided data', async () => {
      const newPostData = {
        title: 'New Post',
        excerpt: 'New excerpt',
        content: 'New content',
        published: true,
      }

      const createdPost = { 
        ...newPostData, 
        id: 'new-post-id', 
        coverUrl: null, 
        authorId: 'author-1', 
        featured: false,
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
      mockPostRepo.create.mockResolvedValue(createdPost)

      const result = await postService.create(newPostData)

      expect(mockPostRepo.create).toHaveBeenCalledWith(newPostData)
      expect(result).toEqual(createdPost)
    })

    it('should handle repository errors', async () => {
      const postData = { title: 'Test' }
      const error = new Error('Creation failed')
      mockPostRepo.create.mockRejectedValue(error)

      await expect(postService.create(postData)).rejects.toThrow('Creation failed')
    })
  })

  describe('getById', () => {
    it('should call repository findByIdPublic with post id', async () => {
      const postId = 'test-post-id'
      mockPostRepo.findByIdPublic.mockResolvedValue(mockPost)

      const result = await postService.getById(postId)

      expect(mockPostRepo.findByIdPublic).toHaveBeenCalledWith(postId)
      expect(result).toEqual(mockPost)
    })

    it('should handle repository errors', async () => {
      const postId = 'test-post-id'
      const error = new Error('Post not found')
      mockPostRepo.findByIdPublic.mockRejectedValue(error)

      await expect(postService.getById(postId)).rejects.toThrow('Post not found')
    })

    it('should return null if post not found', async () => {
      const postId = 'nonexistent-id'
      mockPostRepo.findByIdPublic.mockResolvedValue(null)

      const result = await postService.getById(postId)

      expect(result).toBeNull()
    })
  })

  describe('getByIdAdmin', () => {
    it('should call repository findById with post id', async () => {
      const postId = 'test-post-id'
      mockPostRepo.findById.mockResolvedValue(mockPost)

      const result = await postService.getByIdAdmin(postId)

      expect(mockPostRepo.findById).toHaveBeenCalledWith(postId)
      expect(result).toEqual(mockPost)
    })

    it('should handle repository errors', async () => {
      const postId = 'test-post-id'
      const error = new Error('Post not found')
      mockPostRepo.findById.mockRejectedValue(error)

      await expect(postService.getByIdAdmin(postId)).rejects.toThrow('Post not found')
    })

    it('should return null if post not found', async () => {
      const postId = 'nonexistent-id'
      mockPostRepo.findById.mockResolvedValue(null)

      const result = await postService.getByIdAdmin(postId)

      expect(result).toBeNull()
    })
  })

  describe('remove', () => {
    it('should call repository remove with post id', async () => {
      const postId = 'test-post-id'
      const removedPost = { ...mockPost, id: postId }
      mockPostRepo.remove.mockResolvedValue(removedPost)

      const result = await postService.remove(postId)

      expect(mockPostRepo.remove).toHaveBeenCalledWith(postId)
      expect(result).toEqual(removedPost)
    })

    it('should handle repository errors', async () => {
      const postId = 'test-post-id'
      const error = new Error('Deletion failed')
      mockPostRepo.remove.mockRejectedValue(error)

      await expect(postService.remove(postId)).rejects.toThrow('Deletion failed')
    })
  })

  describe('service layer behavior', () => {
    it('should pass through all calls to repository layer', () => {
      // Verify that the service layer acts as a pass-through
      // In the future, business logic could be added here
      expect(typeof postService.list).toBe('function')
      expect(typeof postService.listPublic).toBe('function')
      expect(typeof postService.create).toBe('function')
      expect(typeof postService.getById).toBe('function')
      expect(typeof postService.getByIdAdmin).toBe('function')
      expect(typeof postService.remove).toBe('function')
    })
  })
})