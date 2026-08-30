import { Image, Palette, Settings, Sparkles, Video } from 'lucide-react'
import type { ReactNode } from 'react'
import type { ThemeName } from '../types/providers'
import { themeNames } from '../config/defaultConfig'

interface ShellProps {
  children: ReactNode
  activeView: string
  onViewChange: (view: string) => void
  theme: ThemeName
  onThemeChange: (theme: ThemeName) => void
  onOpenSettings: () => void
}

const navItems = [
  { id: 'studio', label: 'Studio', icon: Sparkles },
  { id: 'image', label: 'Images', icon: Image },
  { id: 'video', label: 'Video', icon: Video },
]

export function Shell({
  children,
  activeView,
  onViewChange,
  theme,
  onThemeChange,
  onOpenSettings,
}: ShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">
          <span className="brand-symbol">N</span>
          <div>
            <strong>Neon Anime Forge</strong>
            <small>Image and video lab</small>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className={activeView === item.id ? 'active' : ''}
                type="button"
                onClick={() => onViewChange(item.id)}
                title={item.label}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="theme-panel">
          <div className="panel-label">
            <Palette size={16} />
            <span>Main tone</span>
          </div>
          <div className="theme-swatches">
            {themeNames.map((name) => (
              <button
                key={name}
                className={`swatch swatch-${name} ${theme === name ? 'active' : ''}`}
                type="button"
                title={name}
                aria-label={`Use ${name} theme`}
                onClick={() => onThemeChange(name)}
              />
            ))}
          </div>
        </div>

        <button className="settings-button" type="button" onClick={onOpenSettings}>
          <Settings size={18} />
          <span>Provider Config</span>
        </button>
      </aside>

      <main className="main-stage">{children}</main>
    </div>
  )
}
