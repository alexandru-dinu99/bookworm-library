import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { PlusCircle, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import type { Experience } from '../../../data/model'
import ReorderableList from '../../components/ReorderableList'

interface Props {
  items: Experience[]
  onChange: (items: Experience[]) => void
}

export default function ExperienceSection({ items, onChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id ?? null)

  const add = () => {
    const entry: Experience = {
      id: uuidv4(),
      role: '',
      company: '',
      location: '',
      start: '',
      end: '',
      current: false,
      bullets: [''],
    }
    onChange([...items, entry])
    setExpandedId(entry.id)
  }

  const update = (id: string, patch: Partial<Experience>) =>
    onChange(items.map(e => (e.id === id ? { ...e, ...patch } : e)))

  const remove = (id: string) => {
    onChange(items.filter(e => e.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  const updateBullet = (expId: string, bi: number, val: string) => {
    const exp = items.find(e => e.id === expId)!
    update(expId, { bullets: exp.bullets.map((b, i) => (i === bi ? val : b)) })
  }

  const addBullet = (expId: string) => {
    const exp = items.find(e => e.id === expId)!
    update(expId, { bullets: [...exp.bullets, ''] })
  }

  const removeBullet = (expId: string, bi: number) => {
    const exp = items.find(e => e.id === expId)!
    update(expId, { bullets: exp.bullets.filter((_, i) => i !== bi) })
  }

  const toggle = (id: string) => setExpandedId(prev => (prev === id ? null : id))

  return (
    <div className="space-y-2">
      <ReorderableList
        items={items}
        onReorder={onChange}
        renderItem={(exp, _, handle) => (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center bg-gray-50 px-3 py-2 gap-1">
              {handle}
              <button
                type="button"
                onClick={() => toggle(exp.id)}
                className="flex-1 text-left text-sm font-medium text-gray-700 truncate"
              >
                {exp.role || exp.company
                  ? `${exp.role}${exp.company ? ' · ' + exp.company : ''}`
                  : 'New Entry'}
              </button>
              <button type="button" onClick={() => toggle(exp.id)} className="text-gray-400">
                {expandedId === exp.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              <button type="button" onClick={() => remove(exp.id)} className="text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {expandedId === exp.id && (
              <div className="p-3 space-y-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <F label="Role / Title" value={exp.role} onChange={v => update(exp.id, { role: v })} />
                  <F label="Company" value={exp.company} onChange={v => update(exp.id, { company: v })} />
                  <F label="Location" value={exp.location} onChange={v => update(exp.id, { location: v })} />
                  <div />
                  <F label="Start (e.g. Jan 2020)" value={exp.start} onChange={v => update(exp.id, { start: v })} />
                  {!exp.current && (
                    <F label="End" value={exp.end} onChange={v => update(exp.id, { end: v })} />
                  )}
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={e => update(exp.id, { current: e.target.checked, end: '' })}
                    className="rounded accent-primary-700"
                  />
                  Currently working here
                </label>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">Bullet points</span>
                    <button
                      type="button"
                      onClick={() => addBullet(exp.id)}
                      className="text-xs text-primary-700 flex items-center gap-1 hover:underline"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {exp.bullets.map((b, bi) => (
                      <div key={bi} className="flex items-start gap-2">
                        <span className="text-gray-400 text-sm mt-2 flex-shrink-0">•</span>
                        <input
                          value={b}
                          onChange={e => updateBullet(exp.id, bi, e.target.value)}
                          placeholder="Achievement or responsibility…"
                          className={iCls + ' flex-1'}
                        />
                        <button
                          type="button"
                          onClick={() => removeBullet(exp.id, bi)}
                          className="mt-2 text-red-300 hover:text-red-500 flex-shrink-0"
                        >
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
        <PlusCircle className="w-4 h-4" /> Add Experience
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
