type PaginationProps = {
  currentPage: number
  onPageChange: (page: number) => void
  totalPages: number
}

export function Pagination({ currentPage, onPageChange, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Sayfalar">
      <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold disabled:opacity-40" disabled={currentPage === 0} onClick={() => onPageChange(currentPage - 1)} type="button">Önceki</button>
      <span className="text-sm font-semibold text-slate-600">{currentPage + 1} / {totalPages}</span>
      <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold disabled:opacity-40" disabled={currentPage + 1 >= totalPages} onClick={() => onPageChange(currentPage + 1)} type="button">Sonraki</button>
    </nav>
  )
}
