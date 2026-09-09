import { Layout } from "@/components/Layout";
import { AnalyzerPage } from "@/pages/AnalyzerPage";
import { BuddyPage } from "@/pages/BuddyPage";
import { CoachesPage } from "@/pages/CoachesPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { DieticianPage } from "@/pages/DieticianPage";
import { HabitsPage } from "@/pages/HabitsPage";
import { IoTPage } from "@/pages/IoTPage";
import { RecommenderPage } from "@/pages/RecommenderPage";
import { TrainerPage } from "@/pages/TrainerPage";
import { RouterProvider, createRouter } from "@tanstack/react-router";

const _rootRoute = createRouter({
  routeTree: undefined as any,
}).options.defaultComponent;

import { createRootRoute, createRoute } from "@tanstack/react-router";

const rootRouteDef = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRouteDef,
  path: "/",
  component: DashboardPage,
});

const trainerRoute = createRoute({
  getParentRoute: () => rootRouteDef,
  path: "/trainer",
  component: TrainerPage,
});

const dieticianRoute = createRoute({
  getParentRoute: () => rootRouteDef,
  path: "/dietician",
  component: DieticianPage,
});

const iotRoute = createRoute({
  getParentRoute: () => rootRouteDef,
  path: "/iot",
  component: IoTPage,
});

const habitsRoute = createRoute({
  getParentRoute: () => rootRouteDef,
  path: "/habits",
  component: HabitsPage,
});

const buddyRoute = createRoute({
  getParentRoute: () => rootRouteDef,
  path: "/buddy",
  component: BuddyPage,
});

const analyzerRoute = createRoute({
  getParentRoute: () => rootRouteDef,
  path: "/analyzer",
  component: AnalyzerPage,
});

const recommenderRoute = createRoute({
  getParentRoute: () => rootRouteDef,
  path: "/recommender",
  component: RecommenderPage,
});

const coachesRoute = createRoute({
  getParentRoute: () => rootRouteDef,
  path: "/coaches",
  component: CoachesPage,
});

const routeTree = rootRouteDef.addChildren([
  indexRoute,
  trainerRoute,
  dieticianRoute,
  iotRoute,
  habitsRoute,
  buddyRoute,
  analyzerRoute,
  recommenderRoute,
  coachesRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
