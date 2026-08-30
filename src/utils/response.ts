export function getByPath(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value == null) {
      return undefined
    }

    if (Array.isArray(value)) {
      return value[Number(key)]
    }

    if (typeof value === 'object') {
      return (value as Record<string, unknown>)[key]
    }

    return undefined
  }, source)
}

const MEDIA_KEYS = new Set(['url', 'b64_json', 'image_url'])
const CONTAINER_KEYS = ['data', 'images', 'output']
const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/

function isMediaValue(value: unknown): value is string {
  if (typeof value !== 'string' || value.length === 0) {
    return false
  }

  if (value.startsWith('data:image/') || value.startsWith('http://') || value.startsWith('https://')) {
    return true
  }

  const withoutPadding = value.replace(/=+$/, '')
  if (
    withoutPadding.length >= 64 &&
    BASE64_PATTERN.test(withoutPadding)
  ) {
    return true
  }

  return false
}

function normalizeMediaValue(value: string) {
  if (value.startsWith('data:') || value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }

  return `data:image/png;base64,${value}`
}

function findContainerMedia(source: unknown, containerKey: string): string | undefined {
  const value = getByPath(source, containerKey)

  if (!Array.isArray(value)) {
    return undefined
  }

  for (const item of value) {
    if (typeof item !== 'object' || item === null) {
      continue
    }

    const record = item as Record<string, unknown>

    for (const key of MEDIA_KEYS) {
      const candidate = record[key]

      if (isMediaValue(candidate)) {
        return normalizeMediaValue(candidate)
      }
    }
  }

  return undefined
}

function findAnyMedia(source: unknown): string | undefined {
  if (Array.isArray(source)) {
    for (const item of source) {
      const value = findAnyMedia(item)
      if (value) {
        return value
      }
    }
    return undefined
  }

  if (typeof source !== 'object' || source === null) {
    return undefined
  }

  for (const [key, value] of Object.entries(source)) {
    if (MEDIA_KEYS.has(key)) {
      if (isMediaValue(value)) {
        return normalizeMediaValue(value)
      }
      continue
    }

    const nested = findAnyMedia(value)
    if (nested) {
      return nested
    }
  }

  return undefined
}

export function pickResultUrl(source: unknown, path: string) {
  const configured = getByPath(source, path)

  if (isMediaValue(configured)) {
    return normalizeMediaValue(configured)
  }

  for (const key of CONTAINER_KEYS) {
    const container = findContainerMedia(source, key)
    if (container) {
      return container
    }
  }

  return findAnyMedia(source)
}

export function summarizeResponseKeys(source: unknown) {
  const found: string[] = []

  function visit(value: unknown, prefix: string) {
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${prefix}.${index}`))
      return
    }

    if (typeof value !== 'object' || value === null) {
      return
    }

    for (const [key, nested] of Object.entries(value)) {
      if (MEDIA_KEYS.has(key)) {
        found.push(`${prefix}.${key}`)
      }
      visit(nested, `${prefix}.${key}`)
    }
  }

  visit(source, '$')

  return [...new Set(found)]
}

export function findFirstByPath(
  source: unknown,
  paths: string[],
): unknown {
  for (const path of paths) {
    const value = getByPath(source, path)
    if (value !== undefined) {
      return value
    }
  }

  return undefined
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
