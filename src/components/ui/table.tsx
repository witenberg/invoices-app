import type React from "react"

export function Table({ children, className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table className={`min-w-full divide-y divide-gray-200 ${className}`} {...props}>
      {children}
    </table>
  )
}

export function TableHeader({ children, className, ...props }: React.TableHTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`bg-gray-50 ${className}`} {...props}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className, ...props }: React.TableHTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 ${className}`} {...props}>
      {children}
    </tbody>
  )
}

export function TableRow({ children, className, ...props }: React.TableHTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  )
}

export function TableHead({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
      {...props}
    >
      {children}
    </th>
  )
}

export function TableCell({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-6 py-4 whitespace-nowrap ${className}`} {...props}>
      {children}
    </td>
  )
}

