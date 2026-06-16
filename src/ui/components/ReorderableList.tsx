import React from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

function SortableItem({
  id,
  children,
}: {
  id: string
  children: (handle: React.ReactNode) => React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 10 : 'auto',
  }

  const handle = (
    <button
      {...attributes}
      {...listeners}
      data-no-dnd-outline
      className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 p-1 touch-none flex-shrink-0"
      aria-label="Drag to reorder"
      type="button"
    >
      <GripVertical className="w-4 h-4" />
    </button>
  )

  return <div ref={setNodeRef} style={style}>{children(handle)}</div>
}

interface Props<T extends { id: string }> {
  items: T[]
  onReorder: (items: T[]) => void
  renderItem: (item: T, index: number, dragHandle: React.ReactNode) => React.ReactNode
}

export default function ReorderableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
}: Props<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (over && active.id !== over.id) {
      const from = items.findIndex(i => i.id === active.id)
      const to = items.findIndex(i => i.id === over.id)
      onReorder(arrayMove(items, from, to))
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        {items.map((item, index) => (
          <SortableItem key={item.id} id={item.id}>
            {handle => renderItem(item, index, handle)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  )
}
