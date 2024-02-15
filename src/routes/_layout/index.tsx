import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Temporal } from "@js-temporal/polyfill";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/")({
  component: Index,
});

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
        <section className="grid [grid-template-columns:repeat(15,_1fr)] text-lg text-zinc-400 max-w-[1440px] mx-auto items-center">
          <div />
          {Array.from({ length: 14 }).map((_, i) => {
            const currDate = date.subtract({ days: i });
            return (
              <span key={i} className="w-full text-center py-4">
                {currDate.toLocaleString("en-US", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            );
          })}
          {Array.from({ length: 7 }).map(() => (
            <>
              <h4>commit</h4>
              {Array.from({ length: 14 }).map((_, i) => (
                <Checkbox
                  key={i}
                  tabIndex={i}
                  className="h-12 w-full bg-zinc-900 border-none rounded-none focus-visible:ring-inset focus-visible:ring-offset-0 data-[state=checked]:ring-orange-100"
                />
              ))}
            </>
          ))}
        </section>
      </main>
    </div>
  );
}
