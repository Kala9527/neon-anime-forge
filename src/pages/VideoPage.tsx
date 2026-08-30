import { Film, Video } from 'lucide-react'
import type { AppConfig } from '../types/providers'

interface VideoPageProps {
  config: AppConfig
  onProviderChange: (providerId: string) => void
}

export function VideoPage({ config, onProviderChange }: VideoPageProps) {
  return (
    <div className="page-stack">
      <section className="page-header">
        <span className="eyebrow">Motion routing</span>
        <h1>Prepare text-to-video providers and motion settings</h1>
      </section>

      <section className="provider-cards">
        {config.imageProviders.map((provider) => (
          <article
            className={
              config.activeImageProviderId === provider.id
                ? 'provider-card active'
                : 'provider-card'
            }
            key={provider.id}
          >
            <div className="provider-icon">
              <Video size={20} />
            </div>
            <h2>{provider.name}</h2>
            <p>{provider.baseUrl}</p>
            <dl>
              <div>
                <dt>Model</dt>
                <dd>{provider.model}</dd>
              </div>
              <div>
                <dt>Video path</dt>
                <dd>{provider.videoPath}</dd>
              </div>
              <div>
                <dt>Response path</dt>
                <dd>{provider.responsePath}</dd>
              </div>
            </dl>
            <button
              className="secondary-button"
              type="button"
              onClick={() => onProviderChange(provider.id)}
            >
              <Film size={17} />
              Use Provider
            </button>
          </article>
        ))}
      </section>
    </div>
  )
}
