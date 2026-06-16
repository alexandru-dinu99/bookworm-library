export interface TemplateInfo {
  id: string
  name: string
  description: string
}

// To add a new template: drop a folder under public/templates/<id>/
// containing template.html, style.css, render.js — then add an entry here.
export const TEMPLATE_REGISTRY: TemplateInfo[] = [
  {
    id: 'default',
    name: 'Classic',
    description: 'Clean, professional single-column layout with a navy accent.',
  },
]

export function getTemplate(id: string): TemplateInfo | undefined {
  return TEMPLATE_REGISTRY.find(t => t.id === id)
}
