import { defaultConfig } from '../config/defaultConfig'
import type { AppConfig } from '../types/providers'

const STORAGE_KEY = 'neon-anime-forge-config-v2'

export function loadConfig(): AppConfig {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return defaultConfig
  }

  try {
    return {
      ...defaultConfig,
      ...JSON.parse(raw),
    }
  } catch {
    return defaultConfig
  }
}

export function saveConfig(config: AppConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config, null, 2))
}

export function resetConfig() {
  localStorage.removeItem(STORAGE_KEY)
  return defaultConfig
}
