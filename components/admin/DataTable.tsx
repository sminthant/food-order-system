import type { ReactNode } from "react";

export function DataTable({
  caption,
  minWidth = "760px",
  columns,
  children,
}: {
  caption: string;
  minWidth?: string;
  columns: string[];
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-x-auto rounded-2xl border border-line bg-white">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        <caption className="sr-only">{caption}</caption>
        <thead className="text-xs tracking-wide text-muted uppercase">
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col" className="px-4 py-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function DataTableMessage({ colSpan, children }: { colSpan: number; children: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center text-muted">
        {children}
      </td>
    </tr>
  );
}
