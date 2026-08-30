import { BrainCircuit, ImagePlus, ShieldCheck, SlidersHorizontal } from 'lucide-react'
import { ProviderBadge } from '../components/ProviderBadge'
import { PromptWorkbench } from '../components/PromptWorkbench'
import { ResultGallery } from '../components/ResultGallery'
import type {
  GenerationRequest,
  GenerationResult,
  ImageProviderConfig,
  MediaMode,
  TextProviderConfig,
} from '../types/providers'

interface StudioPageProps {
  mode: MediaMode
  results: GenerationResult[]
  imageProvider: ImageProviderConfig
  textProvider: TextProviderConfig
  isGenerating: boolean
  isOptimizing: boolean
  onModeChange: (mode: MediaMode) => void
  onGenerate: (request: GenerationRequest) => void
  onOptimize: (prompt: string) => Promise<string>
  onDelete: (result: GenerationResult) => void
}

export function StudioPage({
  mode,
  results,
  imageProvider,
  textProvider,
  isGenerating,
  isOptimizing,
  onModeChange,
  onGenerate,
  onOptimize,
  onDelete,
}: StudioPageProps) {
  return (
    <div className="page-stack">
      <section className="hero-band">
        <div className="hero-copy">
          <span className="eyebrow">Anime x technology creation desk</span>
          <h1>Shape prompts, route providers, and forge visual output.</h1>
          <p>
            One control surface for OpenAI-style endpoints, local IP services,
            and independent text-model prompt refinement.
          </p>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="holo-frame">
            <span />
            <span />
            <span />
          </div>
          <div className="character-chip">AI</div>
          <div className="scan-lines" />
        </div>
      </section>

      <section className="status-strip">
        <ProviderBadge label="Image API" provider={imageProvider} />
        <ProviderBadge label="Prompt API" provider={textProvider} />
        <div className="capability-list">
          <span>
            <ImagePlus size={16} />
            Text and image input
          </span>
          <span>
            <BrainCircuit size={16} />
            Independent prompt model
          </span>
          <span>
            <SlidersHorizontal size={16} />
            Tunable routes
          </span>
          <span>
            <ShieldCheck size={16} />
            Local config storage
          </span>
        </div>
      </section>

      <PromptWorkbench
        mode={mode}
        isGenerating={isGenerating}
        isOptimizing={isOptimizing}
        onModeChange={onModeChange}
        onGenerate={onGenerate}
        onOptimize={onOptimize}
      />

      <ResultGallery results={results} onDelete={onDelete} />
    </div>
  )
}
