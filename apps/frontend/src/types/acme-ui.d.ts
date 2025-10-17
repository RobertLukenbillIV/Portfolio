// TypeScript declarations for acme-ui components
declare module 'acme-ui' {
  import React from 'react'

  export interface NavigationLink {
    label: string
    href: string
    children?: NavigationLink[]
  }

  export interface NavigationLink {
    label: string
    href?: string
    icon?: string
    onClick?: (e: React.MouseEvent) => void
    children?: NavigationLink[]
  }

  export interface NavigationProps {
    companyName?: string
    position?: 'left' | 'right' | 'top'
    variant?: 'sidebar' | 'dropdown'
    links?: NavigationLink[]
    className?: string
  }

  export interface CardProps {
    title?: string
    children?: React.ReactNode
    footer?: React.ReactNode
    className?: string
    style?: React.CSSProperties
  }

  export interface TabObject {
    label: string
    icon?: string
    badge?: string
    content: React.ReactNode
    disabled?: boolean
    tooltip?: string
    footer?: React.ReactNode
  }

  export interface TabbedCardProps {
    title?: string
    tabs: TabObject[]
    defaultTab?: number
    onTabChange?: (index: number, tab: TabObject) => void
    variant?: 'default' | 'large'
    className?: string
  }

  export interface HeroProps {
    backgroundImage?: string
    title?: string
    subtitle?: string
    variant?: 'static' | 'sticky-third' | 'scroll-responsive'
    height?: string
    children?: React.ReactNode
  }

  export interface TextInputProps {
    label?: string
    type?: string
    placeholder?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
    disabled?: boolean
  }

  export interface SelectProps {
    label?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
    options: Array<{ value: string; label: string }>
    required?: boolean
    disabled?: boolean
  }

  export interface CheckboxProps {
    label?: string
    checked?: boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
  }

  export interface TextAreaProps {
    label?: string
    placeholder?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    rows?: number
    required?: boolean
    disabled?: boolean
  }

  export interface FootnoteProps {
    variant?: 'footer' | 'card'
    content?: string
    socialLinks?: Array<{ label: string; href: string; icon?: string }>
    pageLinks?: Array<{ label: string; href: string }>
  }

  export interface ForumProps {
    user: {
      name: string
      avatar?: string
      role?: string
      isOnline?: boolean
    }
    message: string
    timestamp?: string
    reactions?: Array<{ emoji: string; count: number }>
  }

  export interface ImageGalleryProps {
    images: Array<{
      src: string
      thumbnail?: string
      alt?: string
      caption?: string
    }>
    columns?: number
  }

  // Component exports
  export const Navigation: React.FC<NavigationProps>
  export const Card: React.FC<CardProps>
  export const TabbedCard: React.FC<TabbedCardProps>
  export const Hero: React.FC<HeroProps>
  export const TextInput: React.FC<TextInputProps>
  export const Select: React.FC<SelectProps>
  export const Checkbox: React.FC<CheckboxProps>
  export const TextArea: React.FC<TextAreaProps>
  export const Footnote: React.FC<FootnoteProps>
  export const Forum: React.FC<ForumProps>
  export const ImageGallery: React.FC<ImageGalleryProps>

  // Default export (if any)
  const AcmeUI: {
    Navigation: React.FC<NavigationProps>
    Card: React.FC<CardProps>
    TabbedCard: React.FC<TabbedCardProps>
    Hero: React.FC<HeroProps>
    TextInput: React.FC<TextInputProps>
    Select: React.FC<SelectProps>
    Checkbox: React.FC<CheckboxProps>
    TextArea: React.FC<TextAreaProps>
    Footnote: React.FC<FootnoteProps>
    Forum: React.FC<ForumProps>
    ImageGallery: React.FC<ImageGalleryProps>
  }

  export default AcmeUI
}