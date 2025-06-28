"use client";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import Pagination from "./pagination";

export default function Table({ columns, data, onAdd, showAddButton = false }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState("");

  // Filtrado simple por texto (puedes mejorarlo según tus necesidades)
  const filteredData = filter
    ? data.filter((row) =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(filter.toLowerCase())
      )
    : data;

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
    manualPagination: false,
  });

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border-[#23272e] rounded-xl shadow-2xl bg-[#181a1b]">
        <thead>
          {/* Fila de filtros y botón agregar */}
          <tr>
            <th colSpan={columns.length} className="p-3 bg-[#23272e] rounded-t-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <input
                  type="text"
                  placeholder="Filtrar..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[#353b48] bg-[#23272e] text-white placeholder-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                />
                {showAddButton && (
                  <button
                    onClick={onAdd}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                  >
                    + Nuevo
                  </button>
                )}
              </div>
            </th>
          </tr>
          {/* Fila de títulos */}
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-4 border-b border-[#353b48] bg-[#181a1b] text-[#7fd1fc] font-bold text-left uppercase tracking-wider text-sm shadow-inner"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-6 text-gray-400 bg-[#23272e]">
                No hay registros disponibles
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row, idx) => (
              <tr
                key={row.id}
                className={
                  idx % 2 === 0
                  ? "bg-[#23272e] hover:bg-[#353b48] transition shadow"
                  : "bg-[#181a1b] hover:bg-[#353b48] transition shadow"
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 border-b border-[#353b48] align-middle text-white">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={columns.length} className="p-3 bg-[#23272e] rounded-b-xl">
              <Pagination
                pageIndex={pageIndex}
                pageCount={table.getPageCount()}
                canPreviousPage={table.getCanPreviousPage()}
                canNextPage={table.getCanNextPage()}
                gotoPage={table.setPageIndex}
                previousPage={table.previousPage}
                nextPage={table.nextPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
