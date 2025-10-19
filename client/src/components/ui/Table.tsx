'use client';

import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

// Định nghĩa props mà Table sẽ nhận
// T là một kiểu dữ liệu chung (generic type) cho mỗi hàng
interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  className?: string;
}

export function Table<T>({ data, columns, className }: TableProps<T>) {
  // Sử dụng hook useReactTable để quản lý toàn bộ trạng thái và logic của bảng
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), // Lấy mô hình hàng cốt lõi
  });

  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full text-sm text-left text-gray-500 ${className}`}>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} scope="col" className="px-6 py-3">
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="bg-white border-b hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}