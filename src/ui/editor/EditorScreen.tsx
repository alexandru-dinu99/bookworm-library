import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Eye, CheckCircle, Loader2, ChevronDown, ChevronRight } from 'lucide-react'
import type { CvContent, Language } from '../../data/model'
import { EMPTY_CV_CONTENT } from '../../data/model'
import { getRecord, saveContent, createRecord } from '../../data/repository'
import { TEMPLATE_REGISTRY } from '../../render/registry'
import PersonalSection from './sections/PersonalSection'
import SummarySection from './sections/SummarySection'
import ExperienceSection from './sections/ExperienceSection'
import EducationSection from './sections/EducationSection'
import SkillsSection from './sections/SkillsSection'
import LanguagesSection from './sections/LanguagesSection'
import CustomSectionsSection from './sections/CustomSectionsSection'

const LANGUAGES: Language[] = ['EN', 'RO', 'DE']
const SECTIONS = ['Personal', 'Summary', 'Experience', 'Education', 'Skills', 'Languages', 'Custom'] as const

export default function EditorScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [cvId, setCvId] = useState('')
  const [label, setLabel] = useState('')
  const [language, setLanguage] = useState<Language>('EN')
  const [templateId, setTemplateId] = useState('default')
  const [content, setContent] = useState<CvContent>({ ...EMPTY_CV_CONTENT })
  const [expanded, setExpanded] = useState<number>(0)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [ready, setReady] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const isFirstSave = useRef(true)

  useEffect(() => {
    if (id === 'new') {
      createRecord('Untitled CV').then(rec => {
        setCvId(rec.id)
        setLabel(rec.label)
        setReady(true)
        navigate(`/editor/${rec.id}`, { replace: true })
      })
    } else if (id) {
      getRecord(id).then(rec => {
        if (!rec) { navigate('/'); return }
        setCvId(rec.id)
        setLabel(rec.label)
        setLanguage(rec.language)
        setTemplateId(rec.templateId)
        try { setContent({ ...EMPTY_CV_CONTENT, ...JSON.parse(rec.contentJson) }) }
        catch { setContent({ ...EMPTY_CV_CONTENT }) }
        setReady(true)
      })
    }
  }, [id, navigate])

  const scheduleSave = useCallback(() => {
    clearTimeout(timer.current)
    if (!cvId) return
    if (isFirstSave.current) { isFirstSave.current = false; return } // skip the initial hydration
    setSaveStatus('saving')
    timer.current = setTimeout(async () => {
      await saveContent(cvId, label || 'Untitled CV', templateId, language, content)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 1800)
    }, 700)
  }, [cvId, label, templateId, language, content])

  useEffect(() => {
    if (ready) scheduleSave()
    return () => clearTimeout(timer.current)
  }, [label, language, templateId, content, ready, scheduleSave])

  const toggle = (i: number) => setExpanded(p => (p === i ? -1 : i))

  if (!ready) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-6 h-6 text-primary-700 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* App bar */}
      <header className="bg-primary-700 text-white px-4 py-3 flex items-center gap-3 shadow-md sticky top-0 z-20">
        <button type="button" onClick={() => navigate('/')} className="p-1 -ml-1 rounded-full hover:bg-white/10 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="CV label…"
          className="flex-1 bg-transparent text-white placeholder-white/50 font-semibold text-base outline-none border-b border-white/30 focus:border-white pb-0.5 min-w-0"
        />
        <div className="flex items-center gap-2 flex-shrink-0">
          {saveStatus === 'saving' && <Loader2 className="w-4 h-4 text-white/60 animate-spin" />}
          {saveStatus === 'saved' && <CheckCircle className="w-4 h-4 text-green-300" />}
          <button
            type="button"
            onClick={() => cvId && navigate(`/preview/${cvId}`)}
            disabled={!cvId}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 rounded-lg px-3 py-1.5 text-sm font-medium transition"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>
      </header>

      {/* Language + template meta bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex flex-wrap items-center gap-x-5 gap-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Language</span>
          <div className="flex gap-1">
            {LANGUAGES.map(l => (
              <button
                key={l}
                type="button"
                onClick={() => setLanguage(l)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  language === l
                    ? 'bg-primary-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Template</span>
          <select
            value={templateId}
            onChange={e => setTemplateId(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-700/40"
          >
            {TEMPLATE_REGISTRY.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Accordion sections */}
      <div className="flex-1 divide-y divide-gray-200 bg-white">
        {SECTIONS.map((name, i) => (
          <section key={name}>
            <button
              type="button"
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
            >
              <span className="font-semibold text-gray-800">{name}</span>
              {expanded === i
                ? <ChevronDown className="w-5 h-5 text-gray-400" />
                : <ChevronRight className="w-5 h-5 text-gray-400" />}
            </button>
            {expanded === i && (
              <div className="px-5 pb-5">
                {name === 'Personal' && (
                  <PersonalSection data={content.personal} onChange={p => setContent(c => ({ ...c, personal: p }))} />
                )}
                {name === 'Summary' && (
                  <SummarySection
                    value={content.summary ?? ''}
                    onChange={s => setContent(c => ({ ...c, summary: s || undefined }))}
                  />
                )}
                {name === 'Experience' && (
                  <ExperienceSection items={content.experience} onChange={e => setContent(c => ({ ...c, experience: e }))} />
                )}
                {name === 'Education' && (
                  <EducationSection items={content.education} onChange={e => setContent(c => ({ ...c, education: e }))} />
                )}
                {name === 'Skills' && (
                  <SkillsSection items={content.skills} onChange={s => setContent(c => ({ ...c, skills: s }))} />
                )}
                {name === 'Languages' && (
                  <LanguagesSection items={content.languages} onChange={l => setContent(c => ({ ...c, languages: l }))} />
                )}
                {name === 'Custom' && (
                  <CustomSectionsSection
                    items={content.customSections}
                    onChange={cs => setContent(c => ({ ...c, customSections: cs }))}
                  />
                )}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
