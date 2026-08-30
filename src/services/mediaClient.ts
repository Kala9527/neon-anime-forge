import type {
  GenerationRequest,
  GenerationResult,
  ImageProviderConfig,
  TextProviderConfig,
} from '../types/providers'
import {
  findFirstByPath,
  getByPath,
  pickResultUrl,
  summarizeResponseKeys,
} from '../utils/response'

function joinUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

function authHeaders(provider: ImageProviderConfig | TextProviderConfig) {
  return {
    'Content-Type': 'application/json',
    ...(provider.apiKey ? { Authorization: `Bearer ${provider.apiKey}` } : {}),
    ...provider.headers,
  }
}

function createMockResult(
  request: GenerationRequest,
  providerName: string,
  message: string,
): GenerationResult {
  return {
    id: crypto.randomUUID(),
    mode: request.mode,
    providerName,
    prompt: request.prompt,
    createdAt: new Date().toISOString(),
    dataUrl: request.referenceImage,
    status: 'mock',
    message,
  }
}

export async function optimizePrompt(
  provider: TextProviderConfig,
  prompt: string,
) {
  if (!provider.apiKey && provider.kind !== 'custom') {
    return `${prompt}, anime cinematic lighting, ultra detailed character design, luminous cyberpunk interface, crisp composition, high quality`
  }

  const response = await fetch(joinUrl(provider.baseUrl, provider.chatPath), {
    method: 'POST',
    headers: authHeaders(provider),
    body: JSON.stringify({
      model: provider.model,
      messages: [
        {
          role: 'system',
          content:
            'You optimize image and video generation prompts. Return only the improved prompt in English.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error(`Prompt model request failed: ${response.status}`)
  }

  const json = await response.json()
  const content = getByPath(json, provider.responsePath)

  if (typeof content !== 'string') {
    throw new Error('Prompt model response path did not resolve to text.')
  }

  return content
}

export async function generateMedia(
  provider: ImageProviderConfig,
  request: GenerationRequest,
): Promise<GenerationResult> {
  if (!provider.apiKey && provider.kind !== 'custom') {
    return createMockResult(
      request,
      provider.name,
      'No API key is configured. The request preview was recorded locally.',
    )
  }

  const path =
    request.mode === 'image-to-image'
      ? provider.imageToImagePath
      : request.mode === 'text-to-video'
        ? provider.videoPath
        : provider.textToImagePath

  const payload = {
    model: provider.model,
    prompt: request.prompt,
    negative_prompt: request.negativePrompt,
    n: request.settings.count,
    size: request.settings.size,
    quality: request.settings.quality,
    strength: request.settings.strength,
    fps: request.settings.fps,
    duration: request.settings.duration,
    ...(provider.responsePath.endsWith('b64_json')
      ? { response_format: 'b64_json' }
      : {}),
    ...(request.mode === 'image-to-image' && request.referenceImage
      ? { images: [{ image_url: request.referenceImage }] }
      : {}),
  }

  const response = await fetch(joinUrl(provider.baseUrl, path), {
    method: 'POST',
    headers: authHeaders(provider),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Media request failed: ${response.status}`)
  }

  const json = await response.json()
  const url = pickResultUrl(json, provider.responsePath)
  const revisedPrompt = findFirstByPath(json, [
    'data.0.revised_prompt',
    'images.0.revised_prompt',
    'output.0.revised_prompt',
    'revised_prompt',
  ])
  const foundKeys = summarizeResponseKeys(json)
  const message = url
    ? 'Generation completed.'
    : `Generation completed, but no media URL was found at response path "${provider.responsePath}". Found media keys in response: ${
        foundKeys.length > 0
          ? foundKeys.join(', ')
          : 'none'
      }.`

  return {
    id: crypto.randomUUID(),
    mode: request.mode,
    providerName: provider.name,
    prompt: request.prompt,
    createdAt: new Date().toISOString(),
    url,
    revisedPrompt:
      typeof revisedPrompt === 'string' ? revisedPrompt : undefined,
    status: 'success',
    message,
  }
}
