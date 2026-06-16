import type { CvContent, Language } from '../data/model'

export interface RenderOptions {
  templateId: string
  content: CvContent
  language: Language
}

// Loads the template into the iframe, then calls its renderCV(data, lang) function.
// The iframe must be same-origin (served from /templates/…) for contentWindow access.
export function renderToIframe(
  iframe: HTMLIFrameElement,
  options: RenderOptions,
): Promise<void> {
  const { templateId, content, language } = options
  return new Promise((resolve, reject) => {
    const onLoad = () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const win = iframe.contentWindow as any
        if (typeof win?.renderCV === 'function') {
          win.renderCV(content, language)
          resolve()
        } else {
          reject(new Error('renderCV() not found in template'))
        }
      } catch (e) {
        reject(e)
      }
    }
    iframe.addEventListener('load', onLoad, { once: true })
    iframe.src = `${import.meta.env.BASE_URL}templates/${templateId}/template.html`
  })
}

export function printIframe(iframe: HTMLIFrameElement): void {
  iframe.contentWindow?.focus()
  iframe.contentWindow?.print()
}
