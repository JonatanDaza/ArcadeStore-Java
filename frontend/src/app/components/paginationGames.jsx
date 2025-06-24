"use client";

export default function PaginationGames({
  pageIndex,
  pageCount,
  canPreviousPage,
  canNextPage,
  gotoPage,
  previousPage,
  nextPage,
  pageSize,
  setPageSize,
}) {
  // Calcular el rango de páginas a mostrar (máximo 5)
  let start = Math.max(0, pageIndex - 2);
  let end = Math.min(pageCount, start + 5);
  if (end - start < 5) start = Math.max(0, end - 5);

  const pageNumbers = [];
  for (let i = start; i < end; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-white gap-2">
      {/* Eliminado el selector de filas por página */}
      <div className="flex gap-1">
        <button
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          className="px-3 py-1 bg-[#232323] text-white rounded border border-[#666] hover:bg-[#353535] transition disabled:opacity-50"
        >
          {"<<"}
        </button>
        <button
          onClick={previousPage}
          disabled={!canPreviousPage}
          className="px-3 py-1 bg-[#232323] text-white rounded border border-[#666] hover:bg-[#353535] transition disabled:opacity-50"
        >
          {"Anterior"}
        </button>
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => gotoPage(num)}
            className={`px-3 py-1 rounded border border-[#666] transition ${
              num === pageIndex
                ? "bg-[#3a6aff] text-white font-bold"
                : "bg-[#232323] text-white hover:bg-[#353535]"
            }`}
          >
            {num + 1}
          </button>
        ))}
        <button
          onClick={nextPage}
          disabled={!canNextPage}
          className="px-3 py-1 bg-[#232323] text-white rounded border border-[#666] hover:bg-[#353535] transition disabled:opacity-50"
        >
          {"Siguiente"}
        </button>
        <button
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          className="px-3 py-1 bg-[#232323] text-white rounded border border-[#666] hover:bg-[#353535] transition disabled:opacity-50"
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}