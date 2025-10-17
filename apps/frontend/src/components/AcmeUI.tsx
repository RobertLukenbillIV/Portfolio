// Placeholder ACME UI components since the actual package doesn't export React components
import React from 'react'
import { useNavigate } from 'react-router-dom'

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
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        position: variant === 'sticky' ? 'sticky' : 'relative',
        top: variant === 'sticky' ? '0' : 'auto'
      }}
    >
      <div style={{
        backgroundColor: 'rgba(44, 62, 80, 0.8)', // brandSecondary with transparency
        padding: '2rem',
        borderRadius: '1rem',
        maxWidth: '800px',
        border: '1px solid rgba(52, 152, 219, 0.3)' // brandPrimary border
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          margin: '0 0 1rem 0',
          color: 'white'
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ 
            fontSize: '1.25rem', 
            opacity: 0.9,
            margin: '0',
            color: '#ecf0f1'
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
      backgroundColor: 'var(--card-background, #ffffff)', // White background
      border: '1px solid var(--border-color, #ddd)', // Light gray border
      borderRadius: '0.5rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      color: 'var(--text-primary, #2c3e50)', // Dark text
      ...style
    }}>
      {title && (
        <div style={{
          padding: '1.5rem 1.5rem 0 1.5rem',
          borderBottom: '1px solid var(--border-color, #ddd)' // Light gray border
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600',
            margin: '0 0 1rem 0',
            color: 'var(--text-primary, #2c3e50)' // Dark text
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
          backgroundColor: '#f8f9fa', // Light gray footer
          borderTop: '1px solid var(--border-color, #ddd)' // Light gray border
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
      backgroundColor: 'var(--card-background, #ffffff)', // White background
      border: '1px solid var(--border-color, #ddd)', // Light gray border
      borderRadius: '0.5rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      color: 'var(--text-primary, #2c3e50)' // Dark text
    }}>
      {title && (
        <div style={{
          padding: '1.5rem 1.5rem 0 1.5rem'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600',
            margin: '0 0 1rem 0',
            color: 'var(--text-primary, #2c3e50)' // Dark text
          }}>
            {title}
          </h3>
        </div>
      )}
      
      <div style={{
        borderBottom: '1px solid var(--border-color, #ddd)', // Light gray border
        display: 'flex'
      }}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              backgroundColor: activeTab === index ? 'rgba(52, 152, 219, 0.05)' : 'transparent', // Light blue active
              borderBottom: activeTab === index ? '2px solid #3498db' : '2px solid transparent', // Primary blue
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: activeTab === index ? '#3498db' : 'var(--text-secondary, #7f8c8d)' // Primary blue : secondary gray
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

interface NavigationLink {
  label: string
  href?: string
  icon?: string
  onClick?: (e: React.MouseEvent) => void
  children?: NavigationLink[]
}

interface NavigationProps {
  companyName?: string
  links?: NavigationLink[]
  position?: 'left' | 'right' | 'top'
  variant?: 'sidebar' | 'dropdown'
  className?: string
}

export const Navigation: React.FC<NavigationProps> = ({ 
  companyName = "Portfolio", 
  links = [],
  position = 'left',
  variant = 'sidebar',
  className = "",
  ...props 
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [openSubmenus, setOpenSubmenus] = React.useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const toggleNavigation = () => {
    setIsExpanded(!isExpanded);
    setOpenSubmenus({}); // Close all submenus when toggling main nav
  };

  const toggleSubmenu = (linkKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenSubmenus(prev => ({
      ...prev,
      [linkKey]: !prev[linkKey]
    }));
  };

  const handleLinkClick = (e: React.MouseEvent, link: NavigationLink) => {
    e.preventDefault();
    if (link.onClick) {
      link.onClick(e);
    } else if (link.href) {
      navigate(link.href);
    }
  };

  const renderNavLinks = (navLinks: NavigationLink[], level = 0): React.ReactNode => {
    return (
      <ul className={`nav-links level-${level} list-none p-0 m-0`}>
        {navLinks.map((link, index) => {
          const linkKey = `${level}-${index}`;
          const hasChildren = link.children && link.children.length > 0;
          
          return (
            <li key={linkKey} className={`nav-link-item relative ${hasChildren ? 'has-children bg-black bg-opacity-10' : ''} ${openSubmenus[linkKey] ? 'open' : ''} border-b border-white border-opacity-5`}>
              <div className="nav-link-wrapper flex items-center justify-between">
                <button 
                  onClick={(e) => handleLinkClick(e, link)}
                  className="nav-link block py-4 px-5 text-white no-underline transition-colors duration-200 hover:bg-white hover:bg-opacity-10 flex-1 text-left bg-transparent border-none cursor-pointer w-full"
                >
                  {link.icon && <span className="mr-3">{link.icon}</span>}
                  {link.label}
                </button>
                {hasChildren && (
                  <button 
                    className="submenu-toggle bg-none border-none text-white py-4 px-3 cursor-pointer transition-all duration-200 hover:bg-white hover:bg-opacity-10"
                    onClick={(e) => toggleSubmenu(linkKey, e)}
                    aria-label={`Toggle ${link.label} submenu`}
                  >
                    <span className={`arrow inline-block transition-transform duration-200 text-xs ${openSubmenus[linkKey] ? 'rotate-90' : ''}`}>
                      {position === 'top' ? '▼' : '▶'}
                    </span>
                  </button>
                )}
              </div>
              {hasChildren && openSubmenus[linkKey] && (
                <div className="submenu bg-black bg-opacity-20 border-l-[3px] border-[#3498db] animate-slideDown">
                  {renderNavLinks(link.children!, level + 1)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const navClasses = `acme-navigation ${position} ${variant} ${isExpanded ? 'expanded' : 'collapsed'} ${className}`;

  return (
    <nav 
      className={navClasses}
      style={{
        position: 'fixed',
        top: position === 'top' ? '0' : '20px',
        left: position === 'left' ? '20px' : position === 'top' ? '50%' : 'auto',
        right: position === 'right' ? '20px' : 'auto',
        transform: position === 'top' ? 'translateX(-50%)' : 'none',
        backgroundColor: 'var(--primary-color, #2c3e50)',
        color: '#ecf0f1',
        borderRadius: position === 'top' ? '0 0 12px 12px' : '12px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        width: isExpanded ? (position === 'top' ? '300px' : '280px') : '80px',
        height: isExpanded ? 'auto' : '80px',
        minHeight: isExpanded ? '200px' : '80px',
        overflow: isExpanded ? 'visible' : 'hidden'
      }}
      {...props}
    >
      <div 
        className="nav-header flex items-center transition-all duration-300"
        style={{
          padding: isExpanded ? '20px 15px' : '25px 10px',
          justifyContent: isExpanded ? 'flex-start' : 'center',
          borderBottom: isExpanded ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
        }}
      >
        <button 
          className="nav-toggle bg-none border-none cursor-pointer p-1 flex flex-col justify-between w-8 h-6"
          onClick={toggleNavigation}
          aria-label="Toggle navigation"
        >
          <span className="hamburger-line block w-full h-1 bg-white rounded transition-all duration-300"></span>
          <span className="hamburger-line block w-full h-1 bg-white rounded transition-all duration-300"></span>
          <span className="hamburger-line block w-full h-1 bg-white rounded transition-all duration-300"></span>
        </button>
        {isExpanded && variant === 'sidebar' && (
          <span className="company-name ml-4 text-lg font-bold whitespace-nowrap">{companyName}</span>
        )}
      </div>
      
      {isExpanded && (
        <div className="nav-content flex-1 overflow-y-auto">
          {variant === 'dropdown' && position === 'top' && (
            <div className="company-header py-2 px-3 border-b border-white border-opacity-10 text-center">
              <span className="company-name m-0 text-base font-bold">{companyName}</span>
            </div>
          )}
          {renderNavLinks(links)}
        </div>
      )}
    </nav>
  );
};

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
        backgroundColor: 'white', // White background
        border: '1px solid var(--border-color, #ddd)',
        borderRadius: '0.25rem',
        fontSize: '1rem',
        resize: 'vertical',
        fontFamily: 'inherit',
        color: 'var(--text-primary, #2c3e50)', // Dark text
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#3498db'
        e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)'
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'var(--border-color, #ddd)'
        e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
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
          fontSize: '0.875rem',
          color: 'var(--text-primary, #2c3e50)'
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
          backgroundColor: 'white', // White background
          border: '1px solid var(--border-color, #ddd)',
          borderRadius: '0.25rem',
          fontSize: '1rem',
          fontFamily: 'inherit',
          color: 'var(--text-primary, #2c3e50)', // Dark text
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#3498db'
          e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border-color, #ddd)'
          e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
      />
    </div>
  )
}