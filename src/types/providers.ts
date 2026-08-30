export type ProviderKind =
  | 'openai'
  | 'siliconflow'
  | 'qwen'
  | 'novai'
  | 'custom'

export type MediaMode = 'text-to-image' | 'image-to-image' | 'text-to-video'

export type ProviderRole = 'image' | 'text'

export type ImageResponsePath =
  | 'data.0.url'
  | 'data.0.b64_json'
  | 'images.0.url'
  | 'output.0.b64_json'
  | 'output.0.url'

export type TextResponsePath =
  | 'choices.0.message.content'
  | 'output_text'
  | 'data.output'

export interface BaseProviderConfig {
  id: string
  name: string
  kind: ProviderKind
  role: ProviderRole
  baseUrl: string
  apiKey: string
  model: string
  enabled: boolean
  headers?: Record<string, string>
}

export interface ImageProviderConfig extends BaseProviderConfig {
  role: 'image'
  textToImagePath: string
  imageToImagePath: string
  videoPath: string
  responsePath: ImageResponsePath
}

export interface TextProviderConfig extends BaseProviderConfig {
  role: 'text'
  chatPath: string
  responsePath: TextResponsePath
}

export interface AppConfig {
  activeImageProviderId: string
  activeTextProviderId: string
  theme: ThemeName
  imageProviders: ImageProviderConfig[]
  textProviders: TextProviderConfig[]
}

export type ThemeName = 'aurora' | 'sakura' | 'cyber' | 'mint'

export interface GenerationSettings {
  size: string
  quality: string
  count: number
  strength: number
  fps: number
  duration: number
}

export interface GenerationRequest {
  mode: MediaMode
  prompt: string
  negativePrompt: string
  referenceImage?: string
  settings: GenerationSettings
}

export interface GenerationResult {
  id: string
  mode: MediaMode
  providerName: string
  prompt: string
  createdAt: string
  url?: string
  dataUrl?: string
  revisedPrompt?: string
  status: 'success' | 'mock' | 'error'
  message?: string
}
