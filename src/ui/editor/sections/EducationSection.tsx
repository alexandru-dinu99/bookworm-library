import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { PlusCircle, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import type { Education } from '../../../data/model'
import ReorderableList from '../../components/ReorderableList'

interface Props {
  items: Education[]
  onChange: (items: Education[]) => void
}

export default function EducationSection({ items, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id ?? null)

  const add = () => {
    const entry: Education = { id: uuidv4(), degree: '', institution: '', location: '', start: '', end: '' }
    onChange([...items, entry])
    setExpandedId(entry.id)
  }

  const update = (id: string, patch: Partial<Education>) =>
    onChange(items.map(e => (e.id === id ? { ...e, ...patch } : e)))

  const remove = (id: string) => {
    onChange(items.filter(e => e.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  const toggle = (id: string) => setExpandedId(p => (p === id ? null : id))

  return (
    <div className="space-y-2">
      <ReorderableList
        items={items}
        onReorder={onChange}
        renderItem={(edu, _, handle) => (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center bg-gray-50 px-3 py-2 gap-1">
              {handle}
              <button type="button" onClick={() => toggle(edu.id)} className="flex-1 text-left text-sm font-medium text-gray-700 truncate">
                {edu.degree || edu.institution
                  ? `${edu.degree}${edu.institution ? ' · ' + edu.institution : ''}`
                  : 'New Entry'}
              </button>
              <button type="button" onClick={() => toggle(edu.id)} className="text-gray-400">
                {expandedId === edu.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              <button type="button" onClick={() => remove(edu.id)} className="text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {expandedId === edu.id && (
              <div className="p-3 space-y-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <F label="Degree / Qualification" value={edu.degree} onChange={v => update(edu.id, { degree: v })} />
                  <F label="Institution" value={edu.institution} onChange={v => update(edu.id, { institution: v })} />
                  <F label="Location" value={edu.location} onChange={v => update(edu.id, { location: v })} />
                  <div />
                  <F label="Start" value={edu.start} onChange={v => update(edu.id, { start: v })} />
                  <F label="End" value={edu.end} onChange={v => update(edu.id, { end: v })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Notes (optional)</label>
                  <textarea
                    value={edu.notes ?? ''}
                    onChange={e => update(edu.id, { notes: e.target.value || undefined })}
                    rows={2}
                    placeholder="Thesis, GPA, honours…"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/40 resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      />

      <button
        type="button"
        onClick={add}
        className="w-full border-2 border-dashed border-gray-200 rounded-lg py-3 text-sm text-gray-500 hover:border-primary-700 hover:text-primary-700 transition flex items-center justify-center gap-2"
      >
        <PlusCircle className="w-4 h-4" /> Add Education
      </button>
    </div>
  )
}

const iCls = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/40'

function F({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} className={iCls + ' w-full'} />
    </div>
  )
}
