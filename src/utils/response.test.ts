import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  findFirstByPath,
  pickResultUrl,
  summarizeResponseKeys,
} from './response.ts'

const TINY_PNG_B64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='

describe('pickResultUrl', () => {
  it('returns a base64 value from the configured path', () => {
    const result = pickResultUrl(
      { data: [{ b64_json: TINY_PNG_B64, revised_prompt: 'revised' }] },
      'data.0.b64_json',
    )

    assert.equal(result, `data:image/png;base64,${TINY_PNG_B64}`)
  })

  it('returns a URL value from the configured path', () => {
    const result = pickResultUrl(
      { data: [{ url: 'https://example.com/image.png' }] },
      'data.0.url',
    )

    assert.equal(result, 'https://example.com/image.png')
  })

  it('falls back to data.0.url when the configured b64 path is absent', () => {
    const result = pickResultUrl(
      { data: [{ url: 'https://example.com/image.png' }] },
      'data.0.b64_json',
    )

    assert.equal(result, 'https://example.com/image.png')
  })

  it('falls back to images and output containers', () => {
    assert.equal(
      pickResultUrl(
        { images: [{ url: 'https://example.com/siliconflow.png' }] },
        'data.0.b64_json',
      ),
      'https://example.com/siliconflow.png',
    )
    assert.equal(
      pickResultUrl(
        { output: [{ b64_json: TINY_PNG_B64 }] },
        'data.0.url',
      ),
      `data:image/png;base64,${TINY_PNG_B64}`,
    )
  })

  it('does not treat unrelated metadata strings as media', () => {
    const result = pickResultUrl(
      {
        metadata: { request_id: 'abc' },
        data: [{ b64_json: TINY_PNG_B64 }],
      },
      'data.0.url',
    )

    assert.equal(result, `data:image/png;base64,${TINY_PNG_B64}`)
  })

  it('returns undefined when no media field is present', () => {
    const result = pickResultUrl(
      { error: { message: 'failed' } },
      'data.0.b64_json',
    )

    assert.equal(result, undefined)
  })
})

describe('summarizeResponseKeys', () => {
  it('lists every media key found in the response', () => {
    const result = summarizeResponseKeys({
      data: [{ url: 'https://example.com/a.png' }],
      images: [{ b64_json: TINY_PNG_B64 }],
      output: [{ image_url: '/files/out.png' }],
    })

    assert.deepEqual(result, [
      '$.data.0.url',
      '$.images.0.b64_json',
      '$.output.0.image_url',
    ])
  })
})

describe('findFirstByPath', () => {
  it('returns the first path that resolves', () => {
    const result = findFirstByPath(
      { data: [{ revised_prompt: 'first' }], images: [{ revised_prompt: 'second' }] },
      ['images.0.revised_prompt', 'data.0.revised_prompt'],
    )

    assert.equal(result, 'second')
  })
})
