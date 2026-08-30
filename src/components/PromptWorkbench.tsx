import {
  Eraser,
  ImageUp,
  Loader2,
  Sparkles,
  WandSparkles,
} from 'lucide-react'
import { useState } from 'react'
import { SegmentedControl } from './SegmentedControl'
import type { GenerationRequest, GenerationSettings, MediaMode } from '../types/providers'
import { fileToDataUrl } from '../utils/response'

interface PromptWorkbenchProps {
  mode: MediaMode
  isGenerating: boolean
  isOptimizing: boolean
  onModeChange: (mode: MediaMode) => void
  onGenerate: (request: GenerationRequest) => void
  onOptimize: (prompt: string) => Promise<string>
}

const defaultSettings: GenerationSettings = {
  size: '1024x1024',
  quality: 'standard',
  count: 1,
  strength: 0.65,
  fps: 24,
  duration: 4,
}

const modeOptions = [
  { value: 'text-to-image', label: 'Text to Image' },
  { value: 'image-to-image', label: 'Image to Image' },
  { value: 'text-to-video', label: 'Text to Video' },
] satisfies { value: MediaMode; label: string }[]

export function PromptWorkbench({
  mode,
  isGenerating,
  isOptimizing,
  onModeChange,
  onGenerate,
  onOptimize,
}: PromptWorkbenchProps) {
  const [prompt, setPrompt] = useState(
    'A silver-haired anime engineer tuning a floating holographic camera inside a neon atelier, cinematic lighting',
  )
  const [negativePrompt, setNegativePrompt] = useState(
    'low quality, blurry, distorted hands, watermark',
  )
  const [settings, setSettings] = useState(defaultSettings)
  const [referenceImage, setReferenceImage] = useState<string>()
  const [error, setError] = useState('')

  async function handleOptimize() {
    setError('')

    try {
      const optimized = await onOptimize(prompt)
      setPrompt(optimized)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prompt optimization failed.')
    }
  }

  async function handleUpload(file: File | undefined) {
    if (!file) {
      return
    }

    setReferenceImage(await fileToDataUrl(file))
    onModeChange('image-to-image')
  }

  function handleGenerate() {
    setError('')

    if (mode === 'image-to-image' && !referenceImage) {
      setError('Upload a reference image before using image-to-image.')
      return
    }

    onGenerate({
      mode,
      prompt,
      negativePrompt,
      referenceImage,
      settings,
    })
  }

  return (
    <section className="workbench">
      <div className="workbench-head">
        <div>
          <span className="eyebrow">Creative console</span>
          <h1>Generate anime-tech images and motion concepts</h1>
        </div>
        <SegmentedControl value={mode} options={modeOptions} onChange={onModeChange} />
      </div>

      <div className="prompt-layout">
        <div className="prompt-panel">
          <label className="prompt-field">
            Prompt
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={8}
            />
          </label>

          <label className="prompt-field">
            Negative prompt
            <textarea
              value={negativePrompt}
              onChange={(event) => setNegativePrompt(event.target.value)}
              rows={3}
            />
          </label>

          <div className="action-row">
            <button
              className="secondary-button"
              type="button"
              onClick={handleOptimize}
              disabled={isOptimizing || !prompt.trim()}
            >
              {isOptimizing ? <Loader2 size={17} className="spin" /> : <WandSparkles size={17} />}
              Optimize Prompt
            </button>
            <button className="ghost-button" type="button" onClick={() => setPrompt('')}>
              <Eraser size={17} />
              Clear
            </button>
          </div>
        </div>

        <aside className="settings-panel">
          <label>
            Output size
            <select
              value={settings.size}
              onChange={(event) =>
                setSettings((current) => ({ ...current, size: event.target.value }))
              }
            >
              <option>1024x1024</option>
              <option>1024x1536</option>
              <option>1536x1024</option>
              <option>768x1344</option>
            </select>
          </label>

          <label>
            Quality
            <select
              value={settings.quality}
              onChange={(event) =>
                setSettings((current) => ({ ...current, quality: event.target.value }))
              }
            >
              <option value="standard">Standard</option>
              <option value="hd">HD</option>
              <option value="draft">Draft</option>
            </select>
          </label>

          <label>
            Count
            <input
              min={1}
              max={4}
              type="number"
              value={settings.count}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  count: Number(event.target.value),
                }))
              }
            />
          </label>

          <label>
            Image strength
            <input
              min={0}
              max={1}
              step={0.05}
              type="range"
              value={settings.strength}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  strength: Number(event.target.value),
                }))
              }
            />
            <span>{Math.round(settings.strength * 100)}%</span>
          </label>

          <label>
            Video seconds
            <input
              min={2}
              max={12}
              type="number"
              value={settings.duration}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  duration: Number(event.target.value),
                }))
              }
            />
          </label>

          <label>
            Video FPS
            <input
              min={12}
              max={60}
              type="number"
              value={settings.fps}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  fps: Number(event.target.value),
                }))
              }
            />
          </label>

          <label className="upload-zone">
            <ImageUp size={20} />
            <span>{referenceImage ? 'Reference image ready' : 'Upload reference image'}</span>
            <input
              accept="image/*"
              type="file"
              onChange={(event) => void handleUpload(event.target.files?.[0])}
            />
          </label>

          {referenceImage ? (
            <div className="reference-preview">
              <img src={referenceImage} alt="Reference" />
            </div>
          ) : null}

          {error ? <p className="form-error">{error}</p> : null}

          <button
            className="primary-button generate-button"
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />}
            Generate
          </button>
        </aside>
      </div>
    </section>
  )
}
