import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "../theme-toggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import ProfileDropdown from "./profile-dropdown";

const Header = () => {
  return (
    <header className="flex justify-between px-16 py-4">
      <h1 className="text-2xl">Mugen</h1>
      <section className="flex gap-4">
        <ProfileDropdown/>
      </section>
    </header>
  );
};

export default Header;
