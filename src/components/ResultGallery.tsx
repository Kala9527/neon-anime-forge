import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  ImageIcon,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { GenerationResult } from '../types/providers'

interface ResultGalleryProps {
  results: GenerationResult[]
  onDelete: (result: GenerationResult) => void
}

function MediaPreview({ result }: { result: GenerationResult }) {
  const mediaUrl = result.url ?? result.dataUrl

  if (!mediaUrl) {
    return (
      <div className="result-placeholder">
        <AlertCircle size={28} />
        <span>No media URL</span>
      </div>
    )
  }

  return result.mode === 'text-to-video' ? (
    <video src={mediaUrl} controls />
  ) : (
    <img src={mediaUrl} alt={result.prompt} />
  )
}

export function ResultGallery({ results, onDelete }: ResultGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number>()

  const lightboxResult =
    lightboxIndex === undefined ? undefined : results[lightboxIndex]

  useEffect(() => {
    if (lightboxIndex === undefined) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setLightboxIndex(undefined)
      } else if (event.key === 'ArrowLeft') {
        setLightboxIndex((current) =>
          current === undefined
            ? current
            : (current - 1 + results.length) % results.length,
        )
      } else if (event.key === 'ArrowRight') {
        setLightboxIndex((current) =>
          current === undefined
            ? current
            : (current + 1) % results.length,
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [lightboxIndex, results.length])

  if (results.length === 0) {
    return (
      <section className="gallery-empty">
        <ImageIcon size={32} />
        <h2>Generation queue</h2>
        <p>Completed media and local previews will appear here.</p>
      </section>
    )
  }

  return (
    <section className="gallery-grid">
      {results.map((result) => {
        const mediaUrl = result.url ?? result.dataUrl
        return (
          <article className="result-card" key={result.id}>
            <button
              className="result-preview result-preview-button"
              type="button"
              onClick={() => setLightboxIndex(results.indexOf(result))}
              aria-label="View generated media"
              disabled={!mediaUrl}
            >
              <MediaPreview result={result} />
            </button>
            <div className="result-body">
              <div className="result-meta">
                <span>{result.providerName}</span>
                <span>
                  <Clock size={13} />
                  {new Date(result.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p>{result.prompt}</p>
              {result.revisedPrompt ? (
                <small>Revised: {result.revisedPrompt}</small>
              ) : null}
              {result.message ? <small>{result.message}</small> : null}
              <div className="result-actions">
                <button
                  className="result-delete-button"
                  type="button"
                  onClick={() => onDelete(result)}
                  title="Delete result"
                  aria-label="Delete result"
                >
                  <Trash2 size={16} />
                </button>
                {mediaUrl ? (
                  <>
                    <a href={mediaUrl} target="_blank" rel="noreferrer" title="Open media">
                      <ExternalLink size={16} />
                    </a>
                    <a href={mediaUrl} download title="Download media">
                      <Download size={16} />
                    </a>
                  </>
                ) : null}
              </div>
            </div>
          </article>
        )
      })}

      {lightboxResult && lightboxIndex !== undefined ? (
        <div
          className="lightbox-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setLightboxIndex(undefined)
            }
          }}
        >
          <div className="lightbox-modal" role="dialog" aria-modal="true">
            <header className="lightbox-header">
              <div>
                <span className="eyebrow">{lightboxResult.providerName}</span>
                <h2>{lightboxResult.mode.replace(/-/g, ' ')}</h2>
              </div>
              <div className="lightbox-header-actions">
                <button
                  className="lightbox-delete-button"
                  type="button"
                  onClick={() => {
                    setLightboxIndex(undefined)
                    onDelete(lightboxResult)
                  }}
                  title="Delete result"
                  aria-label="Delete result"
                >
                  <Trash2 size={17} />
                </button>
                <button
                  className="icon-button"
                  type="button"
                  onClick={() => setLightboxIndex(undefined)}
                  title="Close preview"
                  aria-label="Close preview"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            <div className="lightbox-media">
              <MediaPreview result={lightboxResult} />
              {results.length > 1 ? (
                <>
                  <button
                    className="lightbox-nav lightbox-nav-prev"
                    type="button"
                    onClick={() =>
                      setLightboxIndex(
                        (lightboxIndex - 1 + results.length) % results.length,
                      )
                    }
                    title="Previous"
                    aria-label="Previous media"
                  >
                    <ChevronLeft size={26} />
                  </button>
                  <button
                    className="lightbox-nav lightbox-nav-next"
                    type="button"
                    onClick={() =>
                      setLightboxIndex((lightboxIndex + 1) % results.length)
                    }
                    title="Next"
                    aria-label="Next media"
                  >
                    <ChevronRight size={26} />
                  </button>
                </>
              ) : null}
            </div>

            <footer className="lightbox-footer">
              <p>{lightboxResult.prompt}</p>
              {lightboxResult.revisedPrompt ? (
                <small>Revised: {lightboxResult.revisedPrompt}</small>
              ) : null}
              <div className="lightbox-actions">
                {lightboxResult.url || lightboxResult.dataUrl ? (
                  <>
                    <a
                      href={lightboxResult.url ?? lightboxResult.dataUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Open media"
                    >
                      <ExternalLink size={16} />
                      Open
                    </a>
                    <a
                      href={lightboxResult.url ?? lightboxResult.dataUrl}
                      download
                      title="Download media"
                    >
                      <Download size={16} />
                      Download
                    </a>
                  </>
                ) : null}
                <span>
                  <Clock size={13} />
                  {new Date(lightboxResult.createdAt).toLocaleString()}
                </span>
              </div>
            </footer>
          </div>
        </div>
      ) : null}
    </section>
  )
}
