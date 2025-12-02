
export function normalizeTimestamps<T extends { created_at?: Date | string }>(row: T): T {
  if (!row) return row
  if (row.created_at instanceof Date) {
    return { ...row, created_at: row.created_at.toISOString() } as T
  }
  return row
}

export function normalizeMany<T extends { created_at?: Date | string }>(rows: T[]): T[] {
  return rows.map((r) => normalizeTimestamps(r))
}
