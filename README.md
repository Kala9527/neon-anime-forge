# Neon Anime Forge

React + Vite + TypeScript image and video generation console with an anime-tech interface.

## Features

- Text-to-image, image-to-image, and text-to-video request flows.
- Independent image/video API providers and text prompt optimization providers.
- Presets for OpenAI, SiliconFlow, Qwen, NovAI, and custom IP / URL endpoints.
- Frontend provider configuration modal with local saved config.
- Switchable main color themes: aurora, sakura, cyber, and mint.
- Multi-page and multi-component structure for easier maintenance.

## Project Structure

```text
src/
  components/      Shared UI pieces and configuration modal
  config/          Default provider and theme configuration
  hooks/           App configuration state
  pages/           Studio, image provider, and video provider pages
  services/        Text model and media generation clients
  types/           Provider, request, and result types
  utils/           Storage, response parsing, and file helpers
```

## Run

```bash
npm install
npm run dev
```

## Configure APIs

Open the app and click `Provider Config`.

Image/video providers and text providers are configured separately. The saved
configuration is kept in browser local storage and replaces the default provider
settings on the next render.

For OpenAI-compatible services, keep the default request format and update:

- `Base URL`
- `API Key`
- `Model`
- endpoint paths such as `/images/generations`
- `Response path`, such as `data.0.url` or `data.0.b64_json`

The bundled local image provider is configured for:

```text
Base URL: http://192.168.0.117:8080/v1
Model: gpt-image-2
Text-to-image response path: data.0.b64_json
Image-to-image body shape: images: [{ image_url: dataUrl }]
```

Custom LAN or server deployments can use URLs like:

```text
http://192.168.1.50:8000/v1
http://127.0.0.1:7860/v1
```
