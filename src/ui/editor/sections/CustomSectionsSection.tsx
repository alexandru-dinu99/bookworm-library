import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { PlusCircle, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import type { CustomSection } from '../../../data/model'
import ReorderableList from '../../components/ReorderableList'

interface Props {
  items: CustomSection[]
  onChange: (items: CustomSection[]) => void
}

export default function CustomSectionsSection({ items, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id ?? null)

  const add = () => {
    const entry: CustomSection = { id: uuidv4(), heading: '', entries: [''] }
    onChange([...items, entry])
    setExpandedId(entry.id)
  }

  const update = (id: string, patch: Partial<CustomSection>) =>
    onChange(items.map(s => (s.id === id ? { ...s, ...patch } : s)))

  const remove = (id: string) => {
    onChange(items.filter(s => s.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  const updateEntry = (secId: string, ei: number, val: string) => {
    const sec = items.find(s => s.id === secId)!
    update(secId, { entries: sec.entries.map((e, i) => (i === ei ? val : e)) })
  }

  const addEntry = (secId: string) => {
    const sec = items.find(s => s.id === secId)!
    update(secId, { entries: [...sec.entries, ''] })
  }

  const removeEntry = (secId: string, ei: number) => {
    const sec = items.find(s => s.id === secId)!
    update(secId, { entries: sec.entries.filter((_, i) => i !== ei) })
  }

  const toggle = (id: string) => setExpandedId(p => (p === id ? null : id))

  return (
    <div className="space-y-2">
      <ReorderableList
        items={items}
        onReorder={onChange}
        renderItem={(sec, _, handle) => (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center bg-gray-50 px-3 py-2 gap-1">
              {handle}
              <button type="button" onClick={() => toggle(sec.id)} className="flex-1 text-left text-sm font-medium text-gray-700 truncate">
                {sec.heading || 'New Section'}
              </button>
              <button type="button" onClick={() => toggle(sec.id)} className="text-gray-400">
                {expandedId === sec.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              <button type="button" onClick={() => remove(sec.id)} className="text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {expandedId === sec.id && (
              <div className="p-3 space-y-3 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Section Heading</label>
                  <input
                    value={sec.heading}
                    onChange={e => update(sec.id, { heading: e.target.value })}
                    placeholder="e.g. Volunteer Work, Certifications…"
                    className={iCls + ' w-full'}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">Entries</span>
                    <button type="button" onClick={() => addEntry(sec.id)} className="text-xs text-primary-700 flex items-center gap-1 hover:underline">
                      <PlusCircle className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {sec.entries.map((entry, ei) => (
                      <div key={ei} className="flex items-center gap-2">
                        <textarea
                          value={entry}
                          onChange={e => updateEntry(sec.id, ei, e.target.value)}
                          rows={2}
                          placeholder="Entry text…"
                          className={iCls + ' flex-1 resize-none'}
                        />
                        <button type="button" onClick={() => removeEntry(sec.id, ei)} className="text-red-300 hover:text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
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
        <PlusCircle className="w-4 h-4" /> Add Custom Section
      </button>
    </div>
  )
}

const iCls = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/40'
