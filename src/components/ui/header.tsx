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
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
];

const Header = () => {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <header className="flex justify-between px-8 py-6">
      <h1 className="text-2xl">Mugen</h1>
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
