// ACME UI Components - Updated with new primitives and enhanced components
import React from 'react'
import { useNavigate } from 'react-router-dom'

// New Primitive Components

interface ButtonProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  onClick?: (e: React.MouseEvent) => void
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'default',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  children,
  className = '',
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    primary: 'text-white hover:opacity-90 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
  }
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  }
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      style={{
        backgroundColor: variant === 'primary' ? 'var(--primary-color, #3498db)' : undefined
      }}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <Spinner size="small" className="mr-2" />
      )}
      {children}
    </button>
  )
}

interface AvatarProps {
  src?: string
  name?: string
  size?: 'small' | 'medium' | 'large' | 'xl'
  variant?: 'circle' | 'rounded' | 'square'
  status?: 'online' | 'offline' | 'away' | 'busy'
  fallbackIcon?: React.ReactNode
  onClick?: () => void
  className?: string
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src,
  name = '',
  size = 'medium',
  variant = 'circle',
  status,
  fallbackIcon,
  onClick,
  className = '',
  ...props 
}) => {
  const getInitials = (name: string) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-10 h-10 text-sm',
    large: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  }

  const variantClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none'
  }

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  }

  return (
    <div className={`relative inline-block ${className}`} {...props}>
      <div 
        className={`${sizeClasses[size]} ${variantClasses[variant]} bg-gray-200 flex items-center justify-center text-gray-600 font-medium overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
        style={{
          backgroundColor: src ? 'transparent' : 'var(--background-color, #f5f5f5)',
          color: 'var(--text-primary, #2c3e50)'
        }}
      >
        {src ? (
          <img 
            src={src} 
            alt={name || 'Avatar'} 
            className="w-full h-full object-cover"
          />
        ) : fallbackIcon ? (
          fallbackIcon
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {status && (
        <div 
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${statusColors[status]} border-2 border-white rounded-full`}
        />
      )}
    </div>
  )
}

interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark'
  size?: 'small' | 'medium' | 'large'
  dot?: boolean
  children?: React.ReactNode
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'default',
  size = 'medium',
  dot = false,
  children,
  className = '',
  ...props 
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'text-white',
    secondary: 'bg-gray-600 text-white',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    light: 'bg-gray-50 text-gray-600',
    dark: 'bg-gray-800 text-white'
  }

  const sizeClasses = {
    small: dot ? 'w-2 h-2' : 'px-1.5 py-0.5 text-xs',
    medium: dot ? 'w-3 h-3' : 'px-2.5 py-0.5 text-sm',
    large: dot ? 'w-4 h-4' : 'px-3 py-1 text-sm'
  }

  if (dot) {
    return (
      <span 
        className={`inline-block rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        style={{
          backgroundColor: variant === 'primary' ? 'var(--primary-color, #3498db)' : undefined
        }}
        {...props}
      />
    )
  }

  return (
    <span 
      className={`inline-flex items-center justify-center font-medium rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={{
        backgroundColor: variant === 'primary' ? 'var(--primary-color, #3498db)' : undefined
      }}
      {...props}
    >
      {children}
    </span>
  )
}

interface BadgeWrapperProps {
  children: React.ReactNode
  badge: React.ReactNode | string | number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  className?: string
}

export const BadgeWrapper: React.FC<BadgeWrapperProps> = ({ 
  children,
  badge,
  position = 'top-right',
  className = '',
  ...props 
}) => {
  const positionClasses = {
    'top-right': 'top-0 right-0 transform translate-x-1/2 -translate-y-1/2',
    'top-left': 'top-0 left-0 transform -translate-x-1/2 -translate-y-1/2',
    'bottom-right': 'bottom-0 right-0 transform translate-x-1/2 translate-y-1/2',
    'bottom-left': 'bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2'
  }

  return (
    <div className={`relative inline-block ${className}`} {...props}>
      {children}
      <div className={`absolute z-10 ${positionClasses[position]}`}>
        {React.isValidElement(badge) ? badge : <Badge variant="primary">{badge}</Badge>}
      </div>
    </div>
  )
}

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large' | 'xl'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'white'
  variant?: 'circular' | 'dots'
  className?: string
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'medium',
  color = 'primary',
  variant = 'circular',
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    white: 'text-white'
  }

  if (variant === 'circular') {
    return (
      <svg 
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
        style={{
          color: color === 'primary' ? 'var(--primary-color, #3498db)' : undefined
        }}
        fill="none" 
        viewBox="0 0 24 24"
        {...props}
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )
  }

  return (
    <div className={`flex space-x-1 ${className}`} {...props}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
          style={{
            backgroundColor: color === 'primary' ? 'var(--primary-color, #3498db)' : undefined,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  )
}

interface LoadingWrapperProps {
  loading: boolean
  children: React.ReactNode
  loadingText?: string
  className?: string
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ 
  loading,
  children,
  loadingText = 'Loading...',
  className = '',
  ...props 
}) => {
  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`} {...props}>
        <Spinner size="large" className="mb-4" />
        <span className="text-gray-600">{loadingText}</span>
      </div>
    )
  }

  return <>{children}</>
}

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'success' | 'warning' | 'danger'
  label?: string
  className?: string
}

export const Switch: React.FC<SwitchProps> = ({ 
  checked,
  onChange,
  disabled = false,
  size = 'medium',
  color = 'primary',
  label,
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    small: { container: 'w-8 h-4', toggle: 'w-3 h-3' },
    medium: { container: 'w-12 h-6', toggle: 'w-5 h-5' },
    large: { container: 'w-16 h-8', toggle: 'w-7 h-7' }
  }

  const colorClasses = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600'
  }

  return (
    <label className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} {...props}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div 
          className={`${sizeClasses[size].container} rounded-full transition-colors duration-200 ${
            checked 
              ? disabled 
                ? 'bg-gray-400' 
                : colorClasses[color]
              : 'bg-gray-300'
          }`}
          style={{
            backgroundColor: checked && !disabled && color === 'primary' 
              ? 'var(--primary-color, #3498db)' 
              : undefined
          }}
        >
          <div 
            className={`${sizeClasses[size].toggle} absolute top-0.5 left-0.5 bg-white rounded-full transition-transform duration-200 ${
              checked ? `translate-x-${size === 'small' ? '4' : size === 'medium' ? '6' : '8'}` : 'translate-x-0'
            }`}
            style={{
              transform: checked 
                ? `translateX(${size === 'small' ? '16px' : size === 'medium' ? '24px' : '32px'})` 
                : 'translateX(2px)'
            }}
          />
        </div>
      </div>
      {label && <span className="ml-3 text-sm text-gray-700">{label}</span>}
    </label>
  )
}

interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

interface RadioGroupProps {
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  name: string
  orientation?: 'horizontal' | 'vertical'
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'success' | 'warning' | 'danger'
  className?: string
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ 
  options,
  value,
  onChange,
  name,
  orientation = 'vertical',
  size = 'medium',
  color = 'primary',
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  }

  return (
    <div 
      className={`${orientation === 'horizontal' ? 'flex space-x-4' : 'space-y-2'} ${className}`}
      role="radiogroup"
      {...props}
    >
      {options.map((option) => (
        <label 
          key={option.value}
          className={`inline-flex items-center cursor-pointer ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            disabled={option.disabled}
            className="sr-only"
          />
          <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
            <div 
              className={`w-full h-full border-2 rounded-full transition-colors duration-200 ${
                value === option.value 
                  ? option.disabled 
                    ? 'border-gray-400 bg-gray-400'
                    : 'border-blue-600 bg-blue-600'
                  : 'border-gray-300 bg-white'
              }`}
              style={{
                borderColor: value === option.value && !option.disabled && color === 'primary' 
                  ? 'var(--primary-color, #3498db)' 
                  : undefined,
                backgroundColor: value === option.value && !option.disabled && color === 'primary' 
                  ? 'var(--primary-color, #3498db)' 
                  : undefined
              }}
            >
              {value === option.value && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
          </div>
          <span className="ml-3 text-sm text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  )
}

interface TooltipProps {
  content: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'hover' | 'click' | 'focus'
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content,
  position = 'top',
  trigger = 'hover',
  disabled = false,
  children,
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const [shouldShow, setShouldShow] = React.useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800'
  }

  const handleMouseEnter = () => {
    if (trigger === 'hover' && !disabled) {
      setShouldShow(true)
      setTimeout(() => setIsVisible(true), 100)
    }
  }

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setShouldShow(false)
      setIsVisible(false)
    }
  }

  const handleClick = () => {
    if (trigger === 'click' && !disabled) {
      setShouldShow(!shouldShow)
      setIsVisible(!isVisible)
    }
  }

  const handleFocus = () => {
    if (trigger === 'focus' && !disabled) {
      setShouldShow(true)
      setIsVisible(true)
    }
  }

  const handleBlur = () => {
    if (trigger === 'focus') {
      setShouldShow(false)
      setIsVisible(false)
    }
  }

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {children}
      {shouldShow && (
        <div 
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow-lg transition-opacity duration-200 whitespace-nowrap ${positionClasses[position]} ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {content}
          <div 
            className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
          />
        </div>
      )}
    </div>
  )
}

// Advanced Form Components

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  onSearch?: (value: string) => void
  placeholder?: string
  suggestions?: string[]
  loading?: boolean
  debounceMs?: number
  icon?: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export const SearchField: React.FC<SearchFieldProps> = ({ 
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  suggestions = [],
  loading = false,
  debounceMs = 300,
  icon,
  size = 'medium',
  className = '',
  ...props 
}) => {
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = React.useState<string[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-5 py-3 text-base'
  }

  React.useEffect(() => {
    if (value && suggestions.length > 0) {
      const filtered = suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [value, suggestions])

  React.useEffect(() => {
    if (debounceMs > 0 && onSearch) {
      const timer = setTimeout(() => {
        onSearch(value)
      }, debounceMs)
      return () => clearTimeout(timer)
    }
  }, [value, onSearch, debounceMs])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
    if (onSearch) onSearch(suggestion)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value)
      setShowSuggestions(false)
    }
  }

  return (
    <div className={`relative ${className}`} {...props}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full ${sizeClasses[size]} border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            icon ? 'pl-10' : ''
          }`}
          style={{
            borderColor: 'var(--border-color, #d1d5db)',
            backgroundColor: 'var(--background-color, #ffffff)',
            color: 'var(--text-primary, #2c3e50)'
          }}
        />
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Spinner size="small" />
          </div>
        )}
      </div>
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface InputGroupProps {
  children: React.ReactNode
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export const InputGroup: React.FC<InputGroupProps> = ({ 
  children,
  prefix,
  suffix,
  size = 'medium',
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-sm',
    large: 'text-base'
  }

  return (
    <div className={`flex items-center ${sizeClasses[size]} ${className}`} {...props}>
      {prefix && (
        <div className="flex items-center px-3 py-2 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
          {prefix}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
      {suffix && (
        <div className="flex items-center px-3 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-md text-gray-500">
          {suffix}
        </div>
      )}
    </div>
  )
}

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void
  onDrop?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  maxFiles?: number
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileSelect,
  onDrop,
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  disabled = false,
  className = '',
  children,
  ...props 
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const validateFiles = (files: File[]) => {
    let validFiles = Array.from(files)

    if (maxFiles && validFiles.length > maxFiles) {
      validFiles = validFiles.slice(0, maxFiles)
    }

    if (maxSize) {
      validFiles = validFiles.filter(file => file.size <= maxSize)
    }

    return validFiles
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = validateFiles(Array.from(e.target.files))
      onFileSelect(files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return

    if (e.dataTransfer.files) {
      const files = validateFiles(Array.from(e.dataTransfer.files))
      if (onDrop) {
        onDrop(files)
      } else {
        onFileSelect(files)
      }
    }
  }

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
        isDragOver 
          ? 'border-blue-400 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
      } ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      {...props}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
      />
      {children || (
        <div>
          <div className="text-gray-600 mb-2">
            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-gray-600">
            {multiple ? 'Drop files here or click to select' : 'Drop file here or click to select'}
          </p>
          {maxSize && (
            <p className="text-sm text-gray-500 mt-1">
              Max size: {(maxSize / 1024 / 1024).toFixed(1)}MB
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// Existing Components Continue Below...

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
  const navRef = React.useRef<HTMLElement>(null);
  const navigate = useNavigate();

  const toggleNavigation = () => {
    setIsExpanded(!isExpanded);
    setOpenSubmenus({}); // Close all submenus when toggling main nav
  };

  // Close navigation when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node) && isExpanded) {
        setIsExpanded(false);
        setOpenSubmenus({});
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
        setOpenSubmenus({});
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isExpanded]);

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
    // Close navigation after link click
    setIsExpanded(false);
    setOpenSubmenus({});
  };

  const handleHeaderClick = () => {
    if (isExpanded) {
      // If expanded, clicking header should close it
      setIsExpanded(false);
      setOpenSubmenus({});
    } else {
      // If collapsed, clicking should expand it
      setIsExpanded(true);
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
      ref={navRef}
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
      {/* Clickable header area - collapses when expanded, expands when collapsed */}
      <div 
        className="nav-header flex items-center transition-all duration-300 cursor-pointer"
        style={{
          padding: isExpanded ? '20px 15px' : '25px 10px',
          justifyContent: isExpanded ? 'flex-start' : 'center',
          borderBottom: isExpanded ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
        }}
        onClick={handleHeaderClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleHeaderClick();
          }
        }}
        aria-label={isExpanded ? "Collapse navigation" : "Expand navigation"}
      >
        <button 
          className="nav-toggle bg-none border-none cursor-pointer p-1 flex flex-col justify-between w-8 h-6 pointer-events-none"
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

// Utility Components

interface ThemeToggleProps {
  theme: 'light' | 'dark'
  onToggle: (theme: 'light' | 'dark') => void
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  theme,
  onToggle,
  size = 'medium',
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  }

  const iconSize = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  }

  const handleToggle = () => {
    onToggle(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <button
      onClick={handleToggle}
      className={`${sizeClasses[size]} rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      {...props}
    >
      {theme === 'light' ? (
        <svg className={iconSize[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className={iconSize[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  )
}

interface AuthFormProps {
  mode: 'login' | 'register' | 'forgot-password'
  onSubmit: (data: AuthFormData) => void
  loading?: boolean
  error?: string
  className?: string
}

interface AuthFormData {
  email: string
  password?: string
  name?: string
  confirmPassword?: string
}

export const AuthForm: React.FC<AuthFormProps> = ({ 
  mode,
  onSubmit,
  loading = false,
  error,
  className = '',
  ...props 
}) => {
  const [formData, setFormData] = React.useState<AuthFormData>({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Sign In'
      case 'register': return 'Create Account'
      case 'forgot-password': return 'Reset Password'
    }
  }

  const getButtonText = () => {
    if (loading) return 'Processing...'
    switch (mode) {
      case 'login': return 'Sign In'
      case 'register': return 'Create Account'
      case 'forgot-password': return 'Send Reset Link'
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`} {...props}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {mode === 'register' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <TextInput
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <TextInput
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      {mode !== 'forgot-password' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <TextInput
            type="password"
            value={formData.password || ''}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
      )}

      {mode === 'register' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <TextInput
            type="password"
            value={formData.confirmPassword || ''}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="large"
        disabled={loading}
        loading={loading}
        className="w-full"
      >
        {getButtonText()}
      </Button>
    </form>
  )
}

interface UserAvatarMenuProps {
  user: {
    name: string
    email: string
    avatar?: string
  }
  onProfile?: () => void
  onSettings?: () => void
  onLogout: () => void
  className?: string
}

export const UserAvatarMenu: React.FC<UserAvatarMenuProps> = ({ 
  user,
  onProfile,
  onSettings,
  onLogout,
  className = '',
  ...props 
}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={`relative ${className}`} {...props}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        <Avatar
          src={user.avatar}
          name={user.name}
          size="medium"
        />
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-100">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
          <div className="py-1">
            {onProfile && (
              <button
                onClick={() => {
                  onProfile()
                  setIsOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </button>
            )}
            {onSettings && (
              <button
                onClick={() => {
                  onSettings()
                  setIsOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
            )}
            <button
              onClick={() => {
                onLogout()
                setIsOpen(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-800">
                  Something went wrong
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>We're sorry, but something unexpected happened. Please try refreshing the page.</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Refresh Page
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-600">Error Details</summary>
                <pre className="mt-2 text-xs text-gray-500 bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

interface LoadingScreenProps {
  message?: string
  size?: 'small' | 'medium' | 'large'
  overlay?: boolean
  className?: string
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...',
  size = 'large',
  overlay = false,
  className = '',
  ...props 
}) => {
  const containerClasses = overlay 
    ? 'fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50'
    : 'min-h-screen bg-gray-50'

  return (
    <div className={`${containerClasses} flex items-center justify-center ${className}`} {...props}>
      <div className="text-center">
        <Spinner size={size} className="mb-4" />
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  )
}

// Footer component with social media links and page navigation
interface FootnoteProps {
  content?: React.ReactNode
  socialLinks?: Array<{
    href: string
    label: string
    icon?: string
  }>
  pageLinks?: Array<{
    href: string
    label: string
  }>
  variant?: 'footer' | 'card'
  className?: string
}

export const Footnote: React.FC<FootnoteProps> = ({ 
  content = null, 
  socialLinks = [], 
  pageLinks = [],
  variant = 'footer',
  className = '' 
}) => {
  const footerStyles: React.CSSProperties = {
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    padding: '2rem',
    marginTop: 'auto',
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box',
    ...(variant === 'footer' ? {
      margin: 0,
      borderRadius: 0
    } : {
      borderRadius: '12px',
      margin: '1rem auto',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '800px'
    })
  }

  const contentStyles: React.CSSProperties = {
    marginBottom: '2rem',
    lineHeight: 1.6,
    textAlign: 'center'
  }

  const linksContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  }

  const socialLinksStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center', // Center the social links instead of flex-end
    gap: '1rem',
    flexWrap: 'wrap'
  }

  const socialLinkStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#3498db',
    textDecoration: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    border: '1px solid rgba(52, 152, 219, 0.2)'
  }

  const pageLinksStyles: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '0.75rem',
    maxWidth: '100%',
    margin: '0 auto'
  }

  const pageLinkStyles: React.CSSProperties = {
    color: '#bdc3c7',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    border: '1px solid transparent'
  }

  return (
    <footer style={footerStyles} className={className}>
      {content && (
        <div style={contentStyles}>
          {content}
        </div>
      )}
      
      <div style={linksContainerStyles}>
        {/* Social media links */}
        {socialLinks.length > 0 && (
          <div style={socialLinksStyles}>
            {socialLinks.map((link, index) => (
              <a 
                key={index}
                href={link.href} 
                style={socialLinkStyles}
                aria-label={link.label}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(52, 152, 219, 0.2)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(52, 152, 219, 0.1)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {link.icon && <span style={{ fontSize: '1.2rem' }}>{link.icon}</span>}
                {link.label}
              </a>
            ))}
          </div>
        )}
        
        {/* Page links */}
        {pageLinks.length > 0 && (
          <div style={pageLinksStyles}>
            {pageLinks.map((link, index) => (
              <a 
                key={index}
                href={link.href} 
                style={pageLinkStyles}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ecf0f1'
                  e.currentTarget.style.backgroundColor = 'rgba(189, 195, 199, 0.1)'
                  e.currentTarget.style.borderColor = 'rgba(189, 195, 199, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#bdc3c7'
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  )
}