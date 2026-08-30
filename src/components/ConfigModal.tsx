import { RotateCcw, Save, X } from 'lucide-react'
import { useState } from 'react'
import type {
  AppConfig,
  ImageProviderConfig,
  TextProviderConfig,
} from '../types/providers'

interface ConfigModalProps {
  config: AppConfig
  isOpen: boolean
  onClose: () => void
  onSave: (config: AppConfig) => void
  onReset: () => void
}

type ProviderGroup = 'image' | 'text'

export function ConfigModal({
  config,
  isOpen,
  onClose,
  onSave,
  onReset,
}: ConfigModalProps) {
  const [draft, setDraft] = useState(config)
  const [group, setGroup] = useState<ProviderGroup>('image')

  if (!isOpen) {
    return null
  }

  const providers =
    group === 'image' ? draft.imageProviders : draft.textProviders

  function updateImageProvider(id: string, patch: Partial<ImageProviderConfig>) {
    setDraft((current) => ({
      ...current,
      imageProviders: current.imageProviders.map((provider) =>
        provider.id === id ? { ...provider, ...patch } : provider,
      ),
    }))
  }

  function updateTextProvider(id: string, patch: Partial<TextProviderConfig>) {
    setDraft((current) => ({
      ...current,
      textProviders: current.textProviders.map((provider) =>
        provider.id === id ? { ...provider, ...patch } : provider,
      ),
    }))
  }

  function saveAndClose() {
    onSave(draft)
    onClose()
  }

  function resetAndClose() {
    onReset()
    onClose()
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="config-modal" role="dialog" aria-modal="true">
        <header className="modal-header">
          <div>
            <h2>Provider Configuration</h2>
            <p>Image and text model credentials are stored separately.</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </header>

        <div className="config-switch">
          <button
            className={group === 'image' ? 'active' : ''}
            type="button"
            onClick={() => setGroup('image')}
          >
            Image APIs
          </button>
          <button
            className={group === 'text' ? 'active' : ''}
            type="button"
            onClick={() => setGroup('text')}
          >
            Text APIs
          </button>
        </div>

        <div className="active-provider-grid">
          <label>
            Active image API
            <select
              value={draft.activeImageProviderId}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  activeImageProviderId: event.target.value,
                }))
              }
            >
              {draft.imageProviders.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Active text API
            <select
              value={draft.activeTextProviderId}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  activeTextProviderId: event.target.value,
                }))
              }
            >
              {draft.textProviders.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="provider-list">
          {providers.map((provider) => (
            <article className="provider-editor" key={provider.id}>
              <div className="provider-editor-head">
                <strong>{provider.name}</strong>
                <label className="toggle-row">
                  <input
                    type="checkbox"
                    checked={provider.enabled}
                    onChange={(event) =>
                      group === 'image'
                        ? updateImageProvider(provider.id, {
                            enabled: event.target.checked,
                          })
                        : updateTextProvider(provider.id, {
                            enabled: event.target.checked,
                          })
                    }
                  />
                  Enabled
                </label>
              </div>

              <div className="field-grid">
                <label>
                  Name
                  <input
                    value={provider.name}
                    onChange={(event) =>
                      group === 'image'
                        ? updateImageProvider(provider.id, {
                            name: event.target.value,
                          })
                        : updateTextProvider(provider.id, {
                            name: event.target.value,
                          })
                    }
                  />
                </label>
                <label>
                  Base URL
                  <input
                    value={provider.baseUrl}
                    onChange={(event) =>
                      group === 'image'
                        ? updateImageProvider(provider.id, {
                            baseUrl: event.target.value,
                          })
                        : updateTextProvider(provider.id, {
                            baseUrl: event.target.value,
                          })
                    }
                  />
                </label>
                <label>
                  API Key
                  <input
                    type="password"
                    value={provider.apiKey}
                    onChange={(event) =>
                      group === 'image'
                        ? updateImageProvider(provider.id, {
                            apiKey: event.target.value,
                          })
                        : updateTextProvider(provider.id, {
                            apiKey: event.target.value,
                          })
                    }
                  />
                </label>
                <label>
                  Model
                  <input
                    value={provider.model}
                    onChange={(event) =>
                      group === 'image'
                        ? updateImageProvider(provider.id, {
                            model: event.target.value,
                          })
                        : updateTextProvider(provider.id, {
                            model: event.target.value,
                          })
                    }
                  />
                </label>
                {group === 'image' ? (
                  <>
                    <label>
                      Text to image path
                      <input
                        value={(provider as ImageProviderConfig).textToImagePath}
                        onChange={(event) =>
                          updateImageProvider(provider.id, {
                            textToImagePath: event.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Image to image path
                      <input
                        value={(provider as ImageProviderConfig).imageToImagePath}
                        onChange={(event) =>
                          updateImageProvider(provider.id, {
                            imageToImagePath: event.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Video path
                      <input
                        value={(provider as ImageProviderConfig).videoPath}
                        onChange={(event) =>
                          updateImageProvider(provider.id, {
                            videoPath: event.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Response path
                      <select
                        value={(provider as ImageProviderConfig).responsePath}
                        onChange={(event) =>
                          updateImageProvider(provider.id, {
                            responsePath: event.target
                              .value as ImageProviderConfig['responsePath'],
                          })
                        }
                      >
                        <option value="data.0.url">data.0.url</option>
                        <option value="data.0.b64_json">data.0.b64_json</option>
                        <option value="images.0.url">images.0.url</option>
                        <option value="output.0.b64_json">output.0.b64_json</option>
                        <option value="output.0.url">output.0.url</option>
                      </select>
                    </label>
                  </>
                ) : (
                  <>
                    <label>
                      Chat path
                      <input
                        value={(provider as TextProviderConfig).chatPath}
                        onChange={(event) =>
                          updateTextProvider(provider.id, {
                            chatPath: event.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      Response path
                      <select
                        value={(provider as TextProviderConfig).responsePath}
                        onChange={(event) =>
                          updateTextProvider(provider.id, {
                            responsePath: event.target
                              .value as TextProviderConfig['responsePath'],
                          })
                        }
                      >
                        <option value="choices.0.message.content">
                          choices.0.message.content
                        </option>
                        <option value="output_text">output_text</option>
                        <option value="data.output">data.output</option>
                      </select>
                    </label>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>

        <footer className="modal-actions">
          <button type="button" className="ghost-button" onClick={resetAndClose}>
            <RotateCcw size={17} />
            Reset defaults
          </button>
          <button type="button" className="primary-button" onClick={saveAndClose}>
            <Save size={17} />
            Save config
          </button>
        </footer>
      </section>
    </div>
  )
}
