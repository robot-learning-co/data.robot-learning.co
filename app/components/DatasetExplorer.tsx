'use client'

import { useState, useMemo } from 'react'
import LazyVideo from '@/app/components/LazyVideo'

type SortKey = 'name' | 'episodes'
type SortDir = 'asc' | 'desc'
type ViewMode = 'grid' | 'list'

interface Dataset {
  repo: string
  episodes: number | null
  preview_key: string
}

function hfUrl(repo: string) {
  return `https://huggingface.co/datasets/${repo}`
}

function previewUrl(repo: string, preview_key: string) {
  return `${hfUrl(repo)}/resolve/main/videos/${preview_key}/chunk-000/file-000.mp4`
}

export default function DatasetExplorer({ datasets }: { datasets: Dataset[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('episodes')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [view, setView] = useState<ViewMode>('grid')

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = useMemo(() => {
    return [...datasets].sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'episodes') return mul * ((a.episodes ?? -1) - (b.episodes ?? -1))
      return mul * a.repo.localeCompare(b.repo)
    })
  }, [datasets, sortKey, sortDir])

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="text-zinc-400">↕</span>
    return <span>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const btnBase = 'flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors text-sm'
  const btnActive = 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
  const btnInactive = 'border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500'

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
        <span className="text-zinc-500 dark:text-zinc-400">Sort by</span>
        {(['name', 'episodes'] as SortKey[]).map(key => (
          <button
            key={key}
            onClick={() => handleSort(key)}
            className={`${btnBase} ${sortKey === key ? btnActive : btnInactive}`}
          >
            {key === 'name' ? 'Name' : 'Episodes'}
            <SortIcon col={key} />
          </button>
        ))}

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setView('grid')}
            title="Grid view"
            className={`${btnBase} ${view === 'grid' ? btnActive : btnInactive}`}
          >
            <GridIcon />
          </button>
          <button
            onClick={() => setView('list')}
            title="List view"
            className={`${btnBase} ${view === 'list' ? btnActive : btnInactive}`}
          >
            <ListIcon />
          </button>
          <span className="ml-2 text-zinc-400 dark:text-zinc-500">
            {datasets.length} datasets
          </span>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map(ds => (
            <a
              key={ds.repo}
              href={hfUrl(ds.repo)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-xl border border-zinc-200 bg-white overflow-hidden transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="aspect-video w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <LazyVideo
                  src={previewUrl(ds.repo, ds.preview_key)}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-1 p-4">
                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate">
                  {ds.repo.split('/')[0]}/
                </p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50 truncate group-hover:underline">
                  {ds.repo.split('/')[1]}
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {ds.episodes != null ? `${ds.episodes} episodes` : '—'}
                </p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
          {sorted.map(ds => (
            <a
              key={ds.repo}
              href={hfUrl(ds.repo)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <div className="h-14 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <LazyVideo
                  src={previewUrl(ds.repo, ds.preview_key)}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  {ds.repo.split('/')[0]}/
                </p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50 truncate group-hover:underline">
                  {ds.repo.split('/')[1]}
                </p>
              </div>
              <p className="flex-shrink-0 text-sm text-zinc-500 dark:text-zinc-400">
                {ds.episodes != null ? `${ds.episodes} episodes` : '—'}
              </p>
              <svg className="h-4 w-4 flex-shrink-0 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <rect x="0" y="0" width="6" height="6" rx="1" />
      <rect x="8" y="0" width="6" height="6" rx="1" />
      <rect x="0" y="8" width="6" height="6" rx="1" />
      <rect x="8" y="8" width="6" height="6" rx="1" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <rect x="0" y="1" width="14" height="2" rx="1" />
      <rect x="0" y="6" width="14" height="2" rx="1" />
      <rect x="0" y="11" width="14" height="2" rx="1" />
    </svg>
  )
}
