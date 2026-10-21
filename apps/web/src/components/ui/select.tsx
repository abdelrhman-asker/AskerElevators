import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ children, className, ...props }, ref) => <span className="relative block"><select className={cn("h-10 w-full appearance-none rounded-lg border border-border bg-surface py-2 ps-3 pe-9 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring", className)} ref={ref} {...props}>{children}</select><ChevronDown aria-hidden="true" className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /></span>,
);
Select.displayName = "Select";
