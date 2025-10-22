// Footer component for the main portfolio layout
// Uses the ACME UI Footnote component with social media links
// Includes theme toggle button in the bottom right corner

import React, { useState, useEffect } from 'react'
import { Footnote, ThemeToggle } from './AcmeUI'
import { useTheme } from '@/state/theme'
import { api } from '@/lib/api'

export default function Footer() {
  const { theme, toggleTheme } = useTheme()
  const [socialLinks, setSocialLinks] = useState([
    {
      href: 'https://github.com/RobertLukenbillIV',
      label: 'GitHub',
      icon: '🐙'
    },
    {
      href: 'https://linkedin.com/in/robert-lukenbill',
      label: 'LinkedIn', 
      icon: '💼'
    }
  ])

  // Load social media URLs from localStorage and listen for updates
  useEffect(() => {
    const loadSocialLinks = () => {
      // Load from localStorage (temporary solution until database migration)
      const githubUrl = localStorage.getItem('admin_github_url') || 'https://github.com/RobertLukenbillIV'
      const linkedinUrl = localStorage.getItem('admin_linkedin_url') || 'https://linkedin.com/in/robert-lukenbill'
      
      setSocialLinks([
        {
          href: githubUrl,
          label: 'GitHub',
          icon: '🐙'
        },
        {
          href: linkedinUrl,
          label: 'LinkedIn', 
          icon: '💼'
        }
      ])
    }

    // Load initial values
    loadSocialLinks()

    // Listen for updates from admin dashboard
    const handleSocialMediaUpdate = (event: CustomEvent) => {
      loadSocialLinks()
    }

    window.addEventListener('socialMediaUpdated', handleSocialMediaUpdate as EventListener)

    // Cleanup
    return () => {
      window.removeEventListener('socialMediaUpdated', handleSocialMediaUpdate as EventListener)
    }
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <Footnote
        variant="footer"
        content={
          <div>
            <h3 style={{ 
              margin: '0 0 1rem 0', 
              fontSize: '1.5rem',
              color: '#ecf0f1'
            }}>
              Connect with Me
            </h3>
            <p style={{ 
              margin: '0 0 1.5rem 0', 
              fontSize: '1rem', 
              color: '#bdc3c7',
              lineHeight: '1.6'
            }}>
              Here's the following social media links to contact me or find out more about my work:
            </p>
          </div>
        }
        socialLinks={socialLinks}
        pageLinks={[]} // Remove the page links completely
      />
      
      {/* Theme toggle in bottom right corner */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        right: '1rem',
        zIndex: 10
      }}>
        <ThemeToggle 
          theme={theme} 
          onToggle={toggleTheme}
          size="medium"
        />
      </div>
    </div>
  )
}