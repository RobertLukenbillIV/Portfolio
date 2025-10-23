// Navigation header component - persistent across all pages
// Handles authentication UI, role-based navigation, and user logout
// Connected to: useAuth hook for user state, React Router for navigation

import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/state/auth'
import { api } from '@/lib/api'
import { Button, Badge } from './AcmeUI'

export default function Navbar() {
  const { user, logout } = useAuth() // Get current user state and logout function
  const navigate = useNavigate()
  const navRef = useRef<HTMLElement>(null)

  // Handle user logout with confirmation
  // Calls logout function from auth context and redirects to home
  async function handleLogout() {
    await logout() // Clear JWT cookie and local state
    navigate('/') // Redirect to homepage after logout
  }

  // Count featured projects for admin badge
  const [featuredCount, setFeaturedCount] = useState(0)

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      // Fetch featured projects count for admin badge
      api.get('/posts').then(r => {
        const featured = r.data.posts?.filter((p: any) => p.featured)?.length || 0
        setFeaturedCount(featured)
      }).catch(() => {})
    }
  }, [user])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (navRef.current && !navRef.current.contains(event.target as Node) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isMobileMenuOpen])

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav ref={navRef} className="sticky top-0 z-40 bg-brandNavy text-brandFoam border-b border-brandSteel/30">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
        {/* Site logo/title - links to homepage */}
        <Link to="/" className="font-bold tracking-wide hover:opacity-90">My Portfolio</Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden ml-auto p-2 text-brandFoam hover:bg-brandSteel/20 rounded"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Main navigation links - hidden on mobile, shown in mobile menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:flex md:items-center md:gap-4 absolute md:relative top-full md:top-auto left-0 md:left-auto w-full md:w-auto bg-brandNavy md:bg-transparent border-t md:border-t-0 border-brandSteel/30 md:border-none p-4 md:p-0`}>
          <NavLink 
            to="/" 
            className="block md:inline-block py-2 md:py-0 btn-ghost"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink 
            to="/links" 
            className="block md:inline-block py-2 md:py-0 btn-ghost"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Links
          </NavLink>
          <NavLink 
            to="/projects" 
            className="block md:inline-block py-2 md:py-0 btn-ghost"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Projects
          </NavLink>
          <NavLink 
            to="/about" 
            className="block md:inline-block py-2 md:py-0 btn-ghost"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About Me
          </NavLink>
          {/* Admin-only navigation - only visible to authenticated admin users */}
          {user?.role === 'ADMIN' && (
            <NavLink 
              to="/admin" 
              className="block md:inline-block py-2 md:py-0 btn-ghost"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin
              <Badge variant="warning" size="small" className="ml-1">
                {featuredCount > 0 ? `${featuredCount}/3 ⭐` : '⚙️'}
              </Badge>
            </NavLink>
          )}
        </div>

        {/* Authentication section - shows different UI based on login status */}
        <div className="hidden md:flex ml-auto items-center gap-3">
          {user ? (
            // Authenticated user UI - shows logout button
            <Button 
              variant="danger" 
              size="medium"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            // Anonymous user UI - shows login link
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="medium">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile auth section */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-brandNavy border-t border-brandSteel/30 p-4 mt-0">
            <div className="flex flex-col gap-3">
              {user ? (
                <Button 
                  variant="danger" 
                  size="medium" 
                  className="w-full"
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Logout
                </Button>
              ) : (
                <Link 
                  to="/login" 
                  style={{ textDecoration: 'none' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="primary" size="medium" className="w-full">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
