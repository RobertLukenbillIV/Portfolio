// Footer component for the main portfolio layout
// Uses the ACME UI Footnote component with social media links

import React from 'react'
import { Footnote } from './AcmeUI'

export default function Footer() {
  const socialLinks = [
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
  ]

  return (
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
  )
}