'use client';

import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel, // Import thêm
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Button } from './Button'; // Import Button component đã có
import { cn } from '@/lib/utils';

import { TableProps } from '@/types/ui';

export function Table<T>({ 
  data, 
  columns, 
  className,
  pageSize = 10 
}: TableProps<T>) {
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Kích hoạt phân trang
    initialState: {
      pagination: {
        pageSize: pageSize, // Set mặc định số dòng
      },
    },
  });

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3 font-medium">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              // Hiển thị khi không có dữ liệu
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  Không có dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Thanh điều hướng phân trang */}
      {data.length > pageSize && (
        <div className="flex items-center justify-end space-x-2 py-2">
          <div className="text-sm text-gray-500 mr-4">
            Trang {table.getState().pagination.pageIndex + 1} của{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="small"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="small"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}