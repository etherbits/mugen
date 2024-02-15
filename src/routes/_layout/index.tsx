import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createFileRoute } from "@tanstack/react-router";
import { Temporal } from "@js-temporal/polyfill";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/_layout/")({
  component: Index,
});

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Index() {
  const date = Temporal.Now.plainDateISO();
  const calDay = date.day;

  return (
    <div>
      {calDay}
      <div className="flex justify-between">
        <h1 className="text-2xl">Mugen</h1>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://avatars.githubusercontent.com/u/43289097?s=160&v=4" />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
          <ThemeToggle />
        </div>
      </div>
      <main>
        <section className="grid grid-cols-8 text-xl">
          <div />
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className="w-full text-center">
              {date.day - i}
              {weekdays[date.subtract({ days: i }).dayOfWeek]}
            </span>
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <>
              <h4>commit</h4>
              {Array.from({ length: 7 }).map((_, i) => (
                <Checkbox
                  key={i}
                  className="h-12 w-full bg-zinc-900 border-none rounded-none"
                />
              ))}
            </>
          ))}
        </section>
      </main>
    </div>
  );
}
