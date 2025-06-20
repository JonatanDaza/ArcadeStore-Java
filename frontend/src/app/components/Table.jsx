"use client";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";

export default function Table({ columns, data }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const table = useReactTable({
    data,
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
    <div className="overflow-x-auto mt-5">
      <table className="min-w-full rounded-lg bg-[#232323] text-white shadow-lg border border-[#444]">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-4 border-b border-[#444] bg-[#232323] text-white font-bold text-left uppercase tracking-wider text-sm"
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
              <td colSpan={columns.length} className="text-center py-4 text-gray-400">
                No hay registros disponibles
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row, idx) => (
              <tr
                key={row.id}
                className={
                  idx % 2 === 0
                    ? "bg-[#232323] hover:bg-[#353535] transition"
                    : "bg-[#292929] hover:bg-[#353535] transition"
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 border-b border-[#444] align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                {/* ELIMINA este <td> extra con los botones */}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Paginación */}
      <div className="flex justify-between items-center mt-4 text-white">
        <div>
          <span>
            Página {pageIndex + 1} de {table.getPageCount()}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 bg-[#232323] text-white rounded border border-[#666] hover:bg-[#353535] transition disabled:opacity-50"
          >
            {"<<"}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 bg-[#232323] text-white rounded border border-[#666] hover:bg-[#353535] transition disabled:opacity-50"
          >
            {"Anterior"}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 bg-[#232323] text-white rounded border border-[#666] hover:bg-[#353535] transition disabled:opacity-50"
          >
            {"Siguiente"}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 bg-[#232323] text-white rounded border border-[#666] hover:bg-[#353535] transition disabled:opacity-50"
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
}