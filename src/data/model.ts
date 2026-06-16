// ── Data ↔ Template contract (Section 4 of spec) ──────────────────────────────
// This shape is the single source of truth consumed by both the editor UI
// and every HTML/CSS template. Templates must render all optional fields
// gracefully — no empty boxes, no dangling headings.

export type Language = 'RO' | 'DE' | 'EN'

export interface Link {
  label: string
  url: string
}

export interface Personal {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  links: Link[]
  photoBase64?: string
}

export interface Experience {
  id: string
  role: string
  company: string
  location: string
  start: string
  end: string
  current: boolean
  bullets: string[]
}

export interface Education {
  id: string
  degree: string
  institution: string
  location: string
  start: string
  end: string
  notes?: string
}

export interface SkillGroup {
  id: string
  category?: string
  items: string[]
}

export interface LanguageEntry {
  id: string
  language: string
  level: string
}

export interface CustomSection {
  id: string
  heading: string
  entries: string[]
}

export interface CvContent {
  schemaVersion: number
  personal: Personal
  summary?: string
  experience: Experience[]
  education: Education[]
  skills: SkillGroup[]
  languages: LanguageEntry[]
  customSections: CustomSection[]
}

// Stored record (equivalent to Room entity)
export interface CvRecord {
  id: string
  label: string
  templateId: string
  language: Language
  contentJson: string   // serialized CvContent
  updatedAt: number     // epoch ms
  schemaVersion: number
}

export const EMPTY_PERSONAL: Personal = {
  fullName: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  links: [],
}

export const EMPTY_CV_CONTENT: CvContent = {
  schemaVersion: 1,
  personal: { ...EMPTY_PERSONAL },
  summary: undefined,
  experience: [],
  education: [],
  skills: [],
  languages: [],
  customSections: [],
}
