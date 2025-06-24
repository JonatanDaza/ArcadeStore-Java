"use client";
import { MdFirstPage, MdNavigateBefore, MdNavigateNext, MdLastPage } from "react-icons/md";

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
          className="bg-[#23272e] border border-[#353b48] rounded px-2 py-1 text-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="bg-[#23272e] hover:bg-gray-300 text-gray-300 hover:text-gray-900 border-2 border-gray-300 hover:border-gray-400 font-bold py-2 px-3 rounded-xl shadow-lg transition disabled:opacity-40 disabled:cursor-not-allowed mx-1 flex items-center justify-center"
          title="Primera página"
        >
          <MdFirstPage size={24} />
        </button>
        <button
          onClick={previousPage}
          disabled={!canPreviousPage}
          className="bg-[#23272e] hover:bg-gray-300 text-gray-300 hover:text-gray-900 border-2 border-gray-300 hover:border-gray-400 font-bold py-2 px-3 rounded-xl shadow-lg transition disabled:opacity-40 disabled:cursor-not-allowed mx-1 flex items-center justify-center"
          title="Anterior"
        >
          <MdNavigateBefore size={24} />
        </button>
        {pageNumbers.map(i => (
          <button
            key={i}
            onClick={() => gotoPage(i)}
            className={`mx-1 px-3 py-2 rounded-xl font-bold shadow-lg border-2 transition flex items-center justify-center ${
              pageIndex === i
                ? "bg-gray-300 text-gray-900 border-gray-400"
                : "bg-[#23272e] text-gray-300 border-gray-300 hover:bg-gray-300 hover:text-gray-900 hover:border-gray-400"
            }`}
            title={`Página ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={nextPage}
          disabled={!canNextPage}
          className="bg-[#23272e] hover:bg-gray-300 text-gray-300 hover:text-gray-900 border-2 border-gray-300 hover:border-gray-400 font-bold py-2 px-3 rounded-xl shadow-lg transition disabled:opacity-40 disabled:cursor-not-allowed mx-1 flex items-center justify-center"
          title="Siguiente"
        >
          <MdNavigateNext size={24} />
        </button>
        <button
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          className="bg-[#23272e] hover:bg-gray-300 text-gray-300 hover:text-gray-900 border-2 border-gray-300 hover:border-gray-400 font-bold py-2 px-3 rounded-xl shadow-lg transition disabled:opacity-40 disabled:cursor-not-allowed mx-1 flex items-center justify-center"
          title="Última página"
        >
          <MdLastPage size={24} />
        </button>
      </div>
    </div>
  );
}