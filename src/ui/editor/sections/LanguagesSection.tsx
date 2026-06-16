import { v4 as uuidv4 } from 'uuid'
import { PlusCircle, Trash2 } from 'lucide-react'
import type { LanguageEntry } from '../../../data/model'
import ReorderableList from '../../components/ReorderableList'

interface Props {
  items: LanguageEntry[]
  onChange: (items: LanguageEntry[]) => void
}

export default function LanguagesSection({ items, onChange }: Props) {
  const add = () => onChange([...items, { id: uuidv4(), language: '', level: '' }])

  const update = (id: string, patch: Partial<LanguageEntry>) =>
    onChange(items.map(l => (l.id === id ? { ...l, ...patch } : l)))

  const remove = (id: string) => onChange(items.filter(l => l.id !== id))

  return (
    <div className="space-y-2">
      <ReorderableList
        items={items}
        onReorder={onChange}
        renderItem={(entry, _, handle) => (
          <div className="flex items-center gap-2 py-1">
            {handle}
            <input
              value={entry.language}
              onChange={e => update(entry.id, { language: e.target.value })}
              placeholder="Language (e.g. Deutsch)"
              className={iCls + ' flex-1'}
            />
            <input
              value={entry.level}
              onChange={e => update(entry.id, { level: e.target.value })}
              placeholder="Level (e.g. B2 — Proficient)"
              className={iCls + ' flex-1'}
            />
            <button type="button" onClick={() => remove(entry.id)} className="text-red-400 hover:text-red-600 flex-shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      <button
        type="button"
        onClick={add}
        className="w-full border-2 border-dashed border-gray-200 rounded-lg py-3 text-sm text-gray-500 hover:border-primary-700 hover:text-primary-700 transition flex items-center justify-center gap-2"
      >
        <PlusCircle className="w-4 h-4" /> Add Language
      </button>
    </div>
  )
}

const iCls = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/40'
