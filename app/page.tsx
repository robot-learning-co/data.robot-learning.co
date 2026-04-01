import datasetsConfig from '@/public/datasets.json'
import DatasetExplorer from '@/app/components/DatasetExplorer'

async function fetchEpisodes(repo: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://huggingface.co/datasets/${repo}/resolve/main/meta/info.json`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.total_episodes ?? null
  } catch {
    return null
  }
}

export default async function Home() {
  const datasets = await Promise.all(
    datasetsConfig.map(async (ds) => ({
      ...ds,
      episodes: await fetchEpisodes(ds.repo),
    }))
  )

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            TRLC-DK1 Datasets
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            A curated collection of datasets recorded with The Robot Learning Company's TRLC-DK1.
          </p>
        </header>
        <DatasetExplorer datasets={datasets} />
      </div>
    </div>
  )
}
