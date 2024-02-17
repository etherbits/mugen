import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import OptionsDropdown from "@/components/ui/options-dropdown";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";

const navLinks = [
  { name: "Home", title: "Habit Tracking", path: "/" },
  { name: "Dashboard", title: "Habit Statistics", path: "/dashboard" },
];

const Header = () => {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <header className="flex justify-between items-center px-8 py-6">
      <span className="text-2xl">Mugen</span>
      <h1 className="text-foreground text-xl">
        {navLinks.find((navLink) => navLink.path === currentPath)?.title}
      </h1>
      <section className="flex gap-4">
        <NavigationMenu>
          {navLinks.map(({ name, path }) => (
            <NavigationMenuItem key={name}>
              <Link to={path}>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), {
                    "bg-accent": path === currentPath,
                  })}
                >
                  {name}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenu>
        <OptionsDropdown />
      </section>
    </header>
  );
};

export default Header;
