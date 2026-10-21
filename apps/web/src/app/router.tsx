import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { CustomersRoute, DashboardRoute, ElevatorsRoute, RequestsRoute, ScheduleRoute, TechniciansRoute, WebsitePreviewRoute } from "@/app/deferred-pages";
import { HomePage } from "@/features/home/HomePage";
import { NotFoundPage } from "@/features/not-found/NotFoundPage";
import { AppLayout } from "@/layouts/AppLayout";
import { DemoLayout } from "@/layouts/DemoLayout";
import type { ApiClient } from "@/lib/api-client";

export function createRoutes(apiClient: ApiClient): RouteObject[] {
  return [
    { path: "/demo", element: <DemoLayout />, children: [
      { index: true, element: <DashboardRoute /> },
      { path: "requests", element: <RequestsRoute /> },
      { path: "elevators", element: <ElevatorsRoute /> },
      { path: "customers", element: <CustomersRoute /> },
      { path: "technicians", element: <TechniciansRoute /> },
      { path: "schedule", element: <ScheduleRoute /> },
    ] },
    { path: "/website-preview", element: <WebsitePreviewRoute /> },
    { element: <AppLayout />, children: [
      { index: true, element: <HomePage apiClient={apiClient} /> },
      { path: "*", element: <NotFoundPage /> },
    ] },
  ];
}
export function createAppRouter(apiClient: ApiClient) { return createBrowserRouter(createRoutes(apiClient)); }
