import { v4 as uuidv4 } from 'uuid'
import { getDb } from './db'
import { CvRecord, CvContent, EMPTY_CV_CONTENT, Language } from './model'

export async function getAllRecords(): Promise<CvRecord[]> {
  const db = await getDb()
  const all = await db.getAllFromIndex('cv_records', 'by_updated')
  return all.reverse() // newest first
}

export async function getRecord(id: string): Promise<CvRecord | undefined> {
  return (await getDb()).get('cv_records', id)
}

export async function saveRecord(record: CvRecord): Promise<void> {
  await (await getDb()).put('cv_records', record)
}

export async function deleteRecord(id: string): Promise<void> {
  await (await getDb()).delete('cv_records', id)
}

export async function createRecord(
  label: string,
  templateId = 'default',
  language: Language = 'EN',
): Promise<CvRecord> {
  const record: CvRecord = {
    id: uuidv4(),
    label,
    templateId,
    language,
    contentJson: JSON.stringify(EMPTY_CV_CONTENT),
    updatedAt: Date.now(),
    schemaVersion: 1,
  }
  await saveRecord(record)
  return record
}

export async function duplicateRecord(
  sourceId: string,
  newLabel: string,
): Promise<CvRecord | null> {
  const source = await getRecord(sourceId)
  if (!source) return null
  const dup: CvRecord = { ...source, id: uuidv4(), label: newLabel, updatedAt: Date.now() }
  await saveRecord(dup)
  return dup
}

export function parseContent(record: CvRecord): CvContent {
  try {
    return { ...EMPTY_CV_CONTENT, ...JSON.parse(record.contentJson) }
  } catch {
    return { ...EMPTY_CV_CONTENT }
  }
}

export async function saveContent(
  id: string,
  label: string,
  templateId: string,
  language: Language,
  content: CvContent,
): Promise<void> {
  const existing = await getRecord(id)
  await saveRecord({
    id,
    label,
    templateId,
    language,
    contentJson: JSON.stringify(content),
    updatedAt: Date.now(),
    schemaVersion: content.schemaVersion,
    // preserve creation time if record already exists (updatedAt is overwritten above anyway)
    ...(existing ? {} : {}),
  })
}

export async function exportAllJson(): Promise<string> {
  const records = await getAllRecords()
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), records }, null, 2)
}

export async function importFromJson(jsonStr: string): Promise<number> {
  const parsed = JSON.parse(jsonStr) as { records: CvRecord[] }
  const records: CvRecord[] = parsed.records ?? []
  const db = await getDb()
  const tx = db.transaction('cv_records', 'readwrite')
  for (const r of records) await tx.store.put(r)
  await tx.done
  return records.length
}
