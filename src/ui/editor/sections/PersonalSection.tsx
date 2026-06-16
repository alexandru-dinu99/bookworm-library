import { PlusCircle, Trash2 } from 'lucide-react'
import type { Personal, Link } from '../../../data/model'

interface Props {
  data: Personal
  onChange: (data: Personal) => void
}

const TEXT_FIELDS = [
  { key: 'fullName' as const, label: 'Full Name' },
  { key: 'title' as const, label: 'Professional Title' },
  { key: 'email' as const, label: 'Email', type: 'email' },
  { key: 'phone' as const, label: 'Phone', type: 'tel' },
  { key: 'location' as const, label: 'Location' },
]

export default function PersonalSection({ data, onChange }: Props) {
  const patch = (p: Partial<Personal>) => onChange({ ...data, ...p })

  const addLink = () => patch({ links: [...(data.links ?? []), { label: '', url: '' }] })

  const updateLink = (i: number, p: Partial<Link>) =>
    patch({ links: data.links.map((l, idx) => (idx === i ? { ...l, ...p } : l)) })

  const removeLink = (i: number) => patch({ links: data.links.filter((_, idx) => idx !== i) })

  return (
    <div className="space-y-3">
      {TEXT_FIELDS.map(({ key, label, type }) => (
        <Field
          key={key}
          label={label}
          value={data[key] as string}
          type={type}
          onChange={v => patch({ [key]: v } as Partial<Personal>)}
        />
      ))}

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500">Links</span>
          <button onClick={addLink} className="text-xs text-primary-700 flex items-center gap-1 hover:underline">
            <PlusCircle className="w-3.5 h-3.5" /> Add link
          </button>
        </div>
        <div className="space-y-2">
          {(data.links ?? []).map((link, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                placeholder="Label"
                value={link.label}
                onChange={e => updateLink(i, { label: e.target.value })}
                className={inputCls + ' flex-1'}
              />
              <input
                placeholder="URL"
                value={link.url}
                onChange={e => updateLink(i, { url: e.target.value })}
                className={inputCls + ' flex-1'}
              />
              <button onClick={() => removeLink(i)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const inputCls =
  'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/40'

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={inputCls + ' w-full'}
      />
    </div>
  )
}
