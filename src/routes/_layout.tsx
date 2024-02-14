import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout")({
  component: Layout,
});

function Layout() {
  return (
    <div className="px-6 py-4">
      <Outlet />
    </div>
  );
}
