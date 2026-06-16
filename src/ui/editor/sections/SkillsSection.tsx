import { v4 as uuidv4 } from 'uuid'
import { PlusCircle, Trash2 } from 'lucide-react'
import type { SkillGroup } from '../../../data/model'
import ReorderableList from '../../components/ReorderableList'

interface Props {
  items: SkillGroup[]
  onChange: (items: SkillGroup[]) => void
}

export default function SkillsSection({ items, onChange }: Props) {
  const add = () =>
    onChange([...items, { id: uuidv4(), category: '', items: [''] }])

  const update = (id: string, patch: Partial<SkillGroup>) =>
    onChange(items.map(g => (g.id === id ? { ...g, ...patch } : g)))

  const remove = (id: string) => onChange(items.filter(g => g.id !== id))

  const updateSkill = (groupId: string, si: number, val: string) => {
    const g = items.find(x => x.id === groupId)!
    update(groupId, { items: g.items.map((s, i) => (i === si ? val : s)) })
  }

  const addSkill = (groupId: string) => {
    const g = items.find(x => x.id === groupId)!
    update(groupId, { items: [...g.items, ''] })
  }

  const removeSkill = (groupId: string, si: number) => {
    const g = items.find(x => x.id === groupId)!
    update(groupId, { items: g.items.filter((_, i) => i !== si) })
  }

  return (
    <div className="space-y-3">
      <ReorderableList
        items={items}
        onReorder={onChange}
        renderItem={(group, _, handle) => (
          <div className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              {handle}
              <input
                value={group.category ?? ''}
                onChange={e => update(group.id, { category: e.target.value || undefined })}
                placeholder="Category (optional, e.g. Languages)"
                className={iCls + ' flex-1 font-medium'}
              />
              <button type="button" onClick={() => remove(group.id)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 ml-6">
              {group.items.map((skill, si) => (
                <div key={si} className="flex items-center gap-2">
                  <input
                    value={skill}
                    onChange={e => updateSkill(group.id, si, e.target.value)}
                    placeholder="Skill"
                    className={iCls + ' flex-1'}
                  />
                  <button
                    type="button"
                    onClick={() => removeSkill(group.id, si)}
                    className="text-red-300 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addSkill(group.id)}
                className="text-xs text-primary-700 flex items-center gap-1 hover:underline"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Add skill
              </button>
            </div>
          </div>
        )}
      />

      <button
        type="button"
        onClick={add}
        className="w-full border-2 border-dashed border-gray-200 rounded-lg py-3 text-sm text-gray-500 hover:border-primary-700 hover:text-primary-700 transition flex items-center justify-center gap-2"
      >
        <PlusCircle className="w-4 h-4" /> Add Skill Group
      </button>
    </div>
  )
}

const iCls = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/40'
