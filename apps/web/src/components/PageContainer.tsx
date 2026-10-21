import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

interface PageContainerProps extends PropsWithChildren {
  readonly className?: string;
}

export function PageContainer({
  children,
  className,
}: PageContainerProps): React.JSX.Element {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}
