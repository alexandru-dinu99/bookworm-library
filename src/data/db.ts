import { openDB, DBSchema, IDBPDatabase } from 'idb'
import type { CvRecord } from './model'

interface CvBuilderSchema extends DBSchema {
  cv_records: {
    key: string
    value: CvRecord
    indexes: { by_updated: number }
  }
}

let _db: Promise<IDBPDatabase<CvBuilderSchema>> | null = null

export function getDb(): Promise<IDBPDatabase<CvBuilderSchema>> {
  if (!_db) {
    _db = openDB<CvBuilderSchema>('cv-builder', 1, {
      upgrade(db) {
        const store = db.createObjectStore('cv_records', { keyPath: 'id' })
        store.createIndex('by_updated', 'updatedAt')
      },
    })
  }
  return _db
}
