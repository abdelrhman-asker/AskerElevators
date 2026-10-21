import { lazy, Suspense, type ReactElement } from "react";
import { PageLoader } from "@/components/PageLoader";

const DashboardPage = lazy(() => import("@/features/demo/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const RequestsPage = lazy(() => import("@/features/demo/RequestsPage").then((module) => ({ default: module.RequestsPage })));
const ElevatorsPage = lazy(() => import("@/features/demo/ElevatorsPage").then((module) => ({ default: module.ElevatorsPage })));
const CustomersPage = lazy(() => import("@/features/demo/CustomersPage").then((module) => ({ default: module.CustomersPage })));
const TechniciansPage = lazy(() => import("@/features/demo/TechniciansPage").then((module) => ({ default: module.TechniciansPage })));
const SchedulePage = lazy(() => import("@/features/demo/SchedulePage").then((module) => ({ default: module.SchedulePage })));
const WebsitePreviewPage = lazy(() => import("@/features/website-preview/WebsitePreviewPage").then((module) => ({ default: module.WebsitePreviewPage })));

function Boundary({ children }: { readonly children: ReactElement }): React.JSX.Element { return <Suspense fallback={<PageLoader />}>{children}</Suspense>; }
export function DashboardRoute(): React.JSX.Element { return <Boundary><DashboardPage /></Boundary>; }
export function RequestsRoute(): React.JSX.Element { return <Boundary><RequestsPage /></Boundary>; }
export function ElevatorsRoute(): React.JSX.Element { return <Boundary><ElevatorsPage /></Boundary>; }
export function CustomersRoute(): React.JSX.Element { return <Boundary><CustomersPage /></Boundary>; }
export function TechniciansRoute(): React.JSX.Element { return <Boundary><TechniciansPage /></Boundary>; }
export function ScheduleRoute(): React.JSX.Element { return <Boundary><SchedulePage /></Boundary>; }
export function WebsitePreviewRoute(): React.JSX.Element { return <Boundary><WebsitePreviewPage /></Boundary>; }
