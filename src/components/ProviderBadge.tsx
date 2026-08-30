import { Cpu, KeyRound, Link } from 'lucide-react'
import type { ImageProviderConfig, TextProviderConfig } from '../types/providers'

interface ProviderBadgeProps {
  label: string
  provider: ImageProviderConfig | TextProviderConfig
}

export function ProviderBadge({ label, provider }: ProviderBadgeProps) {
  return (
    <div className="provider-badge">
      <span>{label}</span>
      <strong>
        <Cpu size={15} />
        {provider.name}
      </strong>
      <small>
        <Link size={13} />
        {provider.baseUrl || 'No endpoint'}
      </small>
      <small>
        <KeyRound size={13} />
        {provider.apiKey ? 'Key configured' : 'Key empty'}
      </small>
    </div>
  )
}
