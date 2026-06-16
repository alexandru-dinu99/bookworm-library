interface Props {
  value: string
  onChange: (value: string) => void
}

export default function SummarySection({ value, onChange }: Props) {
  return (
    <div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={5}
        placeholder="Write a brief professional summary…"
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/40 resize-none"
      />
      <p className="text-xs text-gray-400 mt-1 text-right">{value.length} chars</p>
    </div>
  )
}
