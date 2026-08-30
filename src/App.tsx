import { useState } from 'react'
import './App.css'
import { ConfigModal } from './components/ConfigModal'
import { Shell } from './components/Shell'
import { useAppConfig } from './hooks/useAppConfig'
import { ImagePage } from './pages/ImagePage'
import { StudioPage } from './pages/StudioPage'
import { VideoPage } from './pages/VideoPage'
import { generateMedia, optimizePrompt } from './services/mediaClient'
import type { GenerationRequest, GenerationResult, MediaMode } from './types/providers'
import { AlertTriangle, Trash2, X } from 'lucide-react'

function App() {
  const {
    config,
    setConfig,
    activeImageProvider,
    activeTextProvider,
    restoreDefaults,
  } = useAppConfig()
  const [activeView, setActiveView] = useState('studio')
  const [mode, setMode] = useState<MediaMode>('text-to-image')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [results, setResults] = useState<GenerationResult[]>([])
  const [pendingDelete, setPendingDelete] = useState<GenerationResult>()

  async function handleOptimize(prompt: string) {
    setIsOptimizing(true)
    try {
      return await optimizePrompt(activeTextProvider, prompt)
    } finally {
      setIsOptimizing(false)
    }
  }

  async function handleGenerate(request: GenerationRequest) {
    setIsGenerating(true)
    try {
      const result = await generateMedia(activeImageProvider, request)
      setResults((current) => [result, ...current])
    } catch (error) {
      setResults((current) => [
        {
          id: crypto.randomUUID(),
          mode: request.mode,
          providerName: activeImageProvider.name,
          prompt: request.prompt,
          createdAt: new Date().toISOString(),
          status: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'The provider returned an unknown error.',
        },
        ...current,
      ])
    } finally {
      setIsGenerating(false)
    }
  }

  function confirmDelete() {
    if (!pendingDelete) {
      return
    }

    setResults((current) =>
      current.filter((result) => result.id !== pendingDelete.id),
    )
    setPendingDelete(undefined)
  }

  const page =
    activeView === 'image' ? (
      <ImagePage
        config={config}
        onProviderChange={(providerId) =>
          setConfig((current) => ({
            ...current,
            activeImageProviderId: providerId,
          }))
        }
      />
    ) : activeView === 'video' ? (
      <VideoPage
        config={config}
        onProviderChange={(providerId) =>
          setConfig((current) => ({
            ...current,
            activeImageProviderId: providerId,
          }))
        }
      />
    ) : (
      <StudioPage
        mode={mode}
        results={results}
        imageProvider={activeImageProvider}
        textProvider={activeTextProvider}
        isGenerating={isGenerating}
        isOptimizing={isOptimizing}
        onModeChange={setMode}
        onGenerate={(request) => void handleGenerate(request)}
        onOptimize={handleOptimize}
        onDelete={setPendingDelete}
      />
    )

  return (
    <Shell
      activeView={activeView}
      theme={config.theme}
      onViewChange={setActiveView}
      onThemeChange={(theme) =>
        setConfig((current) => ({
          ...current,
          theme,
        }))
      }
      onOpenSettings={() => setIsSettingsOpen(true)}
    >
      {page}
      {isSettingsOpen ? (
        <ConfigModal
          config={config}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSave={setConfig}
          onReset={restoreDefaults}
        />
      ) : null}
      {pendingDelete ? (
        <div className="modal-backdrop delete-confirm-backdrop" role="presentation">
          <section
            className="delete-confirm"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
          >
            <header className="delete-confirm-header">
              <div className="delete-confirm-icon">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h2 id="delete-confirm-title">Delete this result?</h2>
                <p>This removes the generated media from the workbench queue.</p>
              </div>
              <button
                className="icon-button"
                type="button"
                onClick={() => setPendingDelete(undefined)}
                title="Cancel"
                aria-label="Cancel delete"
              >
                <X size={18} />
              </button>
            </header>
            <div className="delete-confirm-preview">
              {pendingDelete.url || pendingDelete.dataUrl ? (
                <img
                  src={pendingDelete.url ?? pendingDelete.dataUrl}
                  alt={pendingDelete.prompt}
                />
              ) : null}
              <p>{pendingDelete.prompt}</p>
            </div>
            <footer className="delete-confirm-actions">
              <button
                className="ghost-button"
                type="button"
                onClick={() => setPendingDelete(undefined)}
              >
                Cancel
              </button>
              <button
                className="danger-button"
                type="button"
                onClick={confirmDelete}
              >
                <Trash2 size={17} />
                Delete
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </Shell>
  )
}

export default App
