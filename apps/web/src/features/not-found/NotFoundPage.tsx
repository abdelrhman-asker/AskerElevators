import { Link } from "react-router-dom";

import { PageContainer } from "@/components/PageContainer";
import { buttonVariants } from "@/components/ui/button-variants";
import { useLocale } from "@/i18n/useLocale";

export function NotFoundPage(): React.JSX.Element {
  const { t } = useLocale();

  return (
    <PageContainer className="grid min-h-[70dvh] place-items-center py-16 text-center">
      <section>
        <p aria-hidden="true" className="text-7xl font-bold text-primary/20">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold">{t("notFound.title")}</h1>
        <p className="mt-3 text-muted-foreground">
          {t("notFound.description")}
        </p>
        <Link className={buttonVariants({ className: "mt-7" })} to="/">
          {t("notFound.home")}
        </Link>
      </section>
    </PageContainer>
  );
}
