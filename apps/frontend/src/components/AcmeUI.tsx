// Placeholder ACME UI components since the actual package doesn't export React components
import React from 'react'

interface HeroProps {
  title: string
  subtitle?: string
  variant?: 'static' | 'sticky'
  height?: string
  backgroundImage?: string
  children?: React.ReactNode
}

export const Hero: React.FC<HeroProps> = ({ 
  title, 
  subtitle, 
  variant = 'static', 
  height = '50vh', 
  backgroundImage,
  children 
}) => {
  return (
    <div 
      style={{
        height,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, #A1C2BD 0%, #708993 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f8f9fa',
        textAlign: 'center',
        position: variant === 'sticky' ? 'sticky' : 'relative',
        top: variant === 'sticky' ? '0' : 'auto'
      }}
    >
      <div style={{
        backgroundColor: 'rgba(13, 17, 23, 0.8)', // brandNavy with transparency
        padding: '2rem',
        borderRadius: '1rem',
        maxWidth: '800px',
        border: '1px solid rgba(112, 137, 147, 0.3)' // brandSteel border
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          margin: '0 0 1rem 0',
          color: '#f8f9fa' // brandText
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ 
            fontSize: '1.25rem', 
            opacity: 0.9,
            margin: '0',
            color: '#e9ecef' // brandTextMuted
          }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}

interface CardProps {
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  style?: React.CSSProperties
}

export const Card: React.FC<CardProps> = ({ title, children, footer, style }) => {
  return (
    <div style={{
      backgroundColor: 'rgba(161, 194, 189, 0.2)', // brandMint/20
      border: '1px solid rgba(112, 137, 147, 0.3)', // brandSteel/30
      borderRadius: '1rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      color: '#f8f9fa', // brandText
      ...style
    }}>
      {title && (
        <div style={{
          padding: '1.5rem 1.5rem 0 1.5rem',
          borderBottom: '1px solid rgba(112, 137, 147, 0.3)' // brandSteel/30
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600',
            margin: '0 0 1rem 0',
            color: '#f8f9fa' // brandText
          }}>
            {title}
          </h3>
        </div>
      )}
      <div style={{ padding: '1.5rem' }}>
        {children}
      </div>
      {footer && (
        <div style={{
          padding: '1rem 1.5rem',
          backgroundColor: 'rgba(13, 17, 23, 0.3)', // brandNavy with transparency
          borderTop: '1px solid rgba(112, 137, 147, 0.3)' // brandSteel/30
        }}>
          {footer}
        </div>
      )}
    </div>
  )
}

interface Tab {
  label: string
  icon?: string
  content: React.ReactNode
}

interface TabbedCardProps {
  title?: string
  tabs: Tab[]
  defaultTab?: number
}

export const TabbedCard: React.FC<TabbedCardProps> = ({ title, tabs, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab)

  return (
    <div style={{
      backgroundColor: 'rgba(161, 194, 189, 0.2)', // brandMint/20
      border: '1px solid rgba(112, 137, 147, 0.3)', // brandSteel/30
      borderRadius: '1rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      color: '#f8f9fa' // brandText
    }}>
      {title && (
        <div style={{
          padding: '1.5rem 1.5rem 0 1.5rem'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600',
            margin: '0 0 1rem 0',
            color: '#f8f9fa' // brandText
          }}>
            {title}
          </h3>
        </div>
      )}
      
      <div style={{
        borderBottom: '1px solid rgba(112, 137, 147, 0.3)', // brandSteel/30
        display: 'flex'
      }}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              backgroundColor: activeTab === index ? 'rgba(161, 194, 189, 0.4)' : 'transparent', // brandMint/40
              borderBottom: activeTab === index ? '2px solid #A1C2BD' : '2px solid transparent', // brandMint
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: activeTab === index ? '#f8f9fa' : '#798a98' // brandText : brandFoam
            }}
          >
            {tab.icon && <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      
      <div style={{ padding: '1.5rem' }}>
        {tabs[activeTab]?.content}
      </div>
    </div>
  )
}

interface NavigationProps {
  title?: string
  items: Array<{
    label: string
    href: string
    icon?: string
  }>
  variant?: 'sidebar' | 'dropdown'
}

export const Navigation: React.FC<NavigationProps> = ({ 
  title = "Portfolio", 
  items, 
  variant = 'sidebar' 
}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  if (variant === 'sidebar') {
    return (
      <nav style={{
        width: '250px',
        height: '100vh',
        backgroundColor: '#0d1117', // brandNavy
        color: '#f8f9fa', // brandText
        position: 'fixed',
        left: '0',
        top: '0',
        zIndex: 1000,
        padding: '1rem'
      }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold', 
          marginBottom: '2rem',
          margin: '0 0 2rem 0',
          color: '#f8f9fa' // brandText
        }}>
          {title}
        </h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {items.map((item, index) => (
            <li key={index} style={{ marginBottom: '0.5rem' }}>
              <a
                href={item.href}
                style={{
                  display: 'block',
                  padding: '0.75rem',
                  color: '#f8f9fa', // brandText
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(161, 194, 189, 0.2)' // brandMint/20
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {item.icon && <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>}
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  return (
    <nav style={{
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '1rem',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold',
          margin: 0
        }}>
          {title}
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          ☰
        </button>
      </div>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#1f2937',
          border: '1px solid #374151',
          zIndex: 1000
        }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: '0.5rem' }}>
            {items.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  style={{
                    display: 'block',
                    padding: '0.75rem',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px'
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon && <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}

interface TextAreaProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  rows?: number
}

export const TextArea: React.FC<TextAreaProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  rows = 3 
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%',
        padding: '0.75rem',
        backgroundColor: '#0d1117', // brandNavy  
        border: '2px solid #0d1117',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        resize: 'vertical',
        fontFamily: 'inherit',
        color: '#f8f9fa', // brandText
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
    />
  )
}

interface TextInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: 'text' | 'email' | 'password'
  required?: boolean
  label?: string
}

export const TextInput: React.FC<TextInputProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  type = 'text',
  required,
  label 
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem', 
          fontWeight: '500',
          fontSize: '0.875rem'
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#0d1117', // brandNavy
          border: '2px solid #0d1117',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          fontFamily: 'inherit',
          color: '#f8f9fa', // brandText
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      />
    </div>
  )
}