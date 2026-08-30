import { useEffect, useMemo, useState } from 'react'
import { loadConfig, resetConfig, saveConfig } from '../utils/storage'
import type { AppConfig } from '../types/providers'

export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig>(() => loadConfig())

  useEffect(() => {
    saveConfig(config)
    document.documentElement.dataset.theme = config.theme
  }, [config])

  const activeImageProvider = useMemo(
    () =>
      config.imageProviders.find(
        (provider) => provider.id === config.activeImageProviderId,
      ) ?? config.imageProviders[0],
    [config],
  )

  const activeTextProvider = useMemo(
    () =>
      config.textProviders.find(
        (provider) => provider.id === config.activeTextProviderId,
      ) ?? config.textProviders[0],
    [config],
  )

  return {
    config,
    setConfig,
    activeImageProvider,
    activeTextProvider,
    restoreDefaults: () => setConfig(resetConfig()),
  }
}
