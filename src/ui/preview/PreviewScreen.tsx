import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download, Loader2 } from 'lucide-react'
import { getRecord } from '../../data/repository'
import { EMPTY_CV_CONTENT } from '../../data/model'
import { renderToIframe, printIframe } from '../../render/renderer'
import type { Language } from '../../data/model'

export default function PreviewScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [label, setLabel] = useState('')
  const [isRendered, setIsRendered] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getRecord(id).then(async rec => {
      if (!rec) { navigate('/'); return }
      setLabel(rec.label)
      if (!iframeRef.current) return
      try {
        const content = { ...EMPTY_CV_CONTENT, ...JSON.parse(rec.contentJson) }
        await renderToIframe(iframeRef.current, {
          templateId: rec.templateId,
          content,
          language: rec.language as Language,
        })
        setIsRendered(true)
      } catch (e) {
        setError(String(e))
      }
    })
  }, [id, navigate])

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-primary-700 text-white px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-1 -ml-1 rounded-full hover:bg-white/10 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="flex-1 font-semibold text-sm truncate">{label || 'Preview'}</span>
        <button
          type="button"
          onClick={() => iframeRef.current && printIframe(iframeRef.current)}
          disabled={!isRendered}
          className="flex items-center gap-1.5 bg-white text-primary-700 rounded-lg px-3 py-1.5 text-sm font-semibold hover:bg-gray-100 transition disabled:opacity-40"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </header>

      {/* iframe fills remaining height */}
      <div className="flex-1 relative">
        {!isRendered && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-red-400 p-8 text-sm text-center">
            Render error: {error}
          </div>
        )}
        <iframe
          ref={iframeRef}
          title="CV Preview"
          className="w-full h-full bg-white border-0"
          style={{ display: isRendered ? 'block' : 'none' }}
        />
      </div>
    </div>
  )
}
