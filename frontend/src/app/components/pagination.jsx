"use client";

export default function Pagination({
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
      <div className="flex items-center gap-2">
        <span className="mr-2">Filas por página:</span>
        <select
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
          className="bg-[#232323] border border-[#666] rounded px-2 py-1 text-white"
        >
          {[5, 10, 20, 50].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
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