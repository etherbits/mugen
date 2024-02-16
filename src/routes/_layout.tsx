import Header from "@/components/ui/header";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: Layout,
});

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
