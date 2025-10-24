"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function ResponsiveTable({ columns, data, type = "record" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        Loading {type}s...
      </div>
    );
  }
  const noDataMessage = `No ${type} found.`;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <thead>
          <tr className="border-b dark:border-gray-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn("px-2 py-1 text-left text-sm", col.className)}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="p-3 text-center text-gray-500 dark:text-gray-400"
              >
                {noDataMessage}
              </td>
            </tr>
          )}
          {data.map((row) => (
            <tr
              key={row.id || row.$id}
              className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-2 py-1">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}