import { Image, Images, WandSparkles } from 'lucide-react'
import type { AppConfig } from '../types/providers'

interface ImagePageProps {
  config: AppConfig
  onProviderChange: (providerId: string) => void
}

export function ImagePage({ config, onProviderChange }: ImagePageProps) {
  return (
    <div className="page-stack">
      <section className="page-header">
        <span className="eyebrow">Image routing</span>
        <h1>Choose image providers for generation workflows</h1>
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
              <Image size={20} />
            </div>
            <h2>{provider.name}</h2>
            <p>{provider.baseUrl}</p>
            <dl>
              <div>
                <dt>Model</dt>
                <dd>{provider.model}</dd>
              </div>
              <div>
                <dt>Text path</dt>
                <dd>{provider.textToImagePath}</dd>
              </div>
              <div>
                <dt>Edit path</dt>
                <dd>{provider.imageToImagePath}</dd>
              </div>
            </dl>
            <button
              className="secondary-button"
              type="button"
              onClick={() => onProviderChange(provider.id)}
            >
              <Images size={17} />
              Use Provider
            </button>
          </article>
        ))}
      </section>

      <section className="workflow-band">
        <WandSparkles size={22} />
        <div>
          <h2>Image workflows are OpenAI-compatible by default.</h2>
          <p>
            For vendor-specific gateways, update the endpoint paths and response
            extraction path in Provider Config.
          </p>
        </div>
      </section>
    </div>
  )
}
