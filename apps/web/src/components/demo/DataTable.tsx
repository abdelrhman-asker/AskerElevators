import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export interface DataColumn<T> {
  readonly key: string;
  readonly header: string;
  readonly cell: (item: T) => ReactNode;
  readonly headerClassName?: string;
}

export function DataTable<T>({ columns, items, rowKey }: { readonly columns: readonly DataColumn<T>[]; readonly items: readonly T[]; readonly rowKey: (item: T) => string }): React.JSX.Element {
  return <Card className="hidden overflow-hidden md:block"><div className="overflow-x-auto"><table className="w-full text-start text-sm"><thead className="bg-muted/70 text-xs uppercase tracking-wide text-muted-foreground"><tr>{columns.map((column) => <th className={`px-5 py-4 text-start ${column.headerClassName ?? ""}`} key={column.key}>{column.header}</th>)}</tr></thead><tbody className="divide-y divide-border">{items.map((item) => <tr className="hover:bg-muted/35" key={rowKey(item)}>{columns.map((column) => <td className="px-5 py-4" key={column.key}>{column.cell(item)}</td>)}</tr>)}</tbody></table></div></Card>;
}
