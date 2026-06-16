import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, PlusCircle, Copy, Trash2, Eye, Download, Upload } from 'lucide-react'
import type { CvRecord } from '../../data/model'
import {
  getAllRecords,
  deleteRecord,
  duplicateRecord,
  createRecord,
  exportAllJson,
  importFromJson,
} from '../../data/repository'
import { SEED_CV } from '../../data/seed'
import { saveContent } from '../../data/repository'
import { v4 as uuidv4 } from 'uuid'

export default function HomeScreen() {
  const navigate = useNavigate()
  const [records, setRecords] = useState<CvRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [duplicateTarget, setDuplicateTarget] = useState<string | null>(null)
  const [duplicateLabel, setDuplicateLabel] = useState('')

  const reload = useCallback(async () => {
    setLoading(true)
    try { setRecords(await getAllRecords()) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { reload() }, [reload])

  const handleNew = async () => {
    const rec = await createRecord('Untitled CV')
    navigate(`/editor/${rec.id}`)
  }

  const handleSeedNew = async () => {
    const id = uuidv4()
    await saveContent(id, 'Sample CV (EN)', 'default', 'EN', SEED_CV)
    reload()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this CV? This cannot be undone.')) return
    await deleteRecord(id)
    setRecords(prev => prev.filter(r => r.id !== id))
  }

  const openDuplicate = (id: string, label: string) => {
    setDuplicateLabel(`${label} (copy)`)
    setDuplicateTarget(id)
  }

  const confirmDuplicate = async () => {
    if (!duplicateTarget || !duplicateLabel.trim()) return
    const dup = await duplicateRecord(duplicateTarget, duplicateLabel.trim())
    if (dup) setRecords(prev => [dup, ...prev])
    setDuplicateTarget(null)
  }

  const handleExport = async () => {
    const json = await exportAllJson()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cv-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      try {
        const count = await importFromJson(await file.text())
        alert(`Imported ${count} CV(s).`)
        reload()
      } catch {
        alert('Import failed — invalid file format.')
      }
    }
    input.click()
  }

  const fmt = (ms: number) =>
    new Date(ms).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* App bar */}
      <header className="bg-primary-700 text-white px-4 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight">CV Builder</h1>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleSeedNew}
            className="px-3 py-1.5 text-xs rounded-lg bg-white/10 hover:bg-white/20 transition"
            title="Add sample CV"
          >
            Sample
          </button>
          <button onClick={handleImport} className="p-2 rounded-full hover:bg-white/10 transition" title="Import backup">
            <Upload className="w-5 h-5" />
          </button>
          <button onClick={handleExport} className="p-2 rounded-full hover:bg-white/10 transition" title="Export backup">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* List */}
      <main className="flex-1 max-w-lg w-full mx-auto p-4">
        {loading ? (
          <div className="flex justify-center mt-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700" />
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-28 text-center">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-xl font-semibold text-gray-600 mb-1">No CVs yet</p>
            <p className="text-sm text-gray-400">Tap + to create one, or add a Sample to try the templates.</p>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            {records.map(r => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => navigate(`/editor/${r.id}`)}
                  className="w-full text-left px-4 py-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{r.label || 'Untitled CV'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {r.language} · {r.templateId} · {fmt(r.updatedAt)}
                      </p>
                    </div>
                    <FileText className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  </div>
                </button>
                <div className="border-t border-gray-100 grid grid-cols-3 divide-x divide-gray-100">
                  <ActionBtn onClick={() => navigate(`/preview/${r.id}`)} icon={<Eye className="w-3.5 h-3.5" />} label="Preview" color="text-primary-700" />
                  <ActionBtn onClick={() => openDuplicate(r.id, r.label)} icon={<Copy className="w-3.5 h-3.5" />} label="Duplicate" color="text-gray-600" />
                  <ActionBtn onClick={() => handleDelete(r.id)} icon={<Trash2 className="w-3.5 h-3.5" />} label="Delete" color="text-red-500" hoverBg="hover:bg-red-50" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={handleNew}
        className="fixed bottom-6 right-6 bg-primary-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl hover:bg-primary-600 active:scale-95 transition"
        aria-label="New CV"
      >
        <PlusCircle className="w-7 h-7" />
      </button>

      {/* Duplicate dialog */}
      {duplicateTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Duplicate CV</h2>
            <input
              autoFocus
              type="text"
              value={duplicateLabel}
              onChange={e => setDuplicateLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && confirmDuplicate()}
              placeholder="Label for the copy"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary-700/40"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setDuplicateTarget(null)}
                className="flex-1 py-2.5 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDuplicate}
                disabled={!duplicateLabel.trim()}
                className="flex-1 py-2.5 text-sm bg-primary-700 text-white rounded-xl hover:bg-primary-600 transition disabled:opacity-40"
              >
                Duplicate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ActionBtn({
  onClick, icon, label, color, hoverBg = 'hover:bg-gray-50',
}: {
  onClick: () => void
  icon: React.ReactNode
  label: string
  color: string
  hoverBg?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`py-2.5 text-xs font-medium flex items-center justify-center gap-1 ${color} ${hoverBg} transition`}
    >
      {icon}
      {label}
    </button>
  )
}
