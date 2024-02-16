import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Temporal } from "@js-temporal/polyfill";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/_layout/")({
  component: Index,
});

const habitTitleMinWidth = 160;
const colCount = 16;

function Index() {
  const habitGridRef = useRef<HTMLDivElement>(null);
  const date = Temporal.Now.plainDateISO();
  const calDay = date.day;
  const [habitBlockCount, setHabitBlockCount] = useState(0);
  const [habitTitleWidth, setHabitTitleWidth] = useState(habitTitleMinWidth);

  useEffect(() => {
    function resizeHandler() {
      const habitAreaWidth =
        (habitGridRef.current?.clientWidth || 0) - habitTitleMinWidth;

      const habitAreaRemainder = habitAreaWidth % 64;

      setHabitTitleWidth(habitTitleMinWidth + habitAreaRemainder);

      setHabitBlockCount(Math.floor(habitAreaWidth / 64));
    }

    resizeHandler();

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  });

  return (
    <div>
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
      <main className="py-8">
        <Card className="px-6 py-4">
          <section
            ref={habitGridRef}
            className={`grid text-zinc-400 w-full mx-auto items-center`}
            style={{
              gridTemplateColumns: `${habitTitleWidth}px repeat(auto-fill, 64px)`,
            }}
          >
            <div />
            {Array.from({ length: habitBlockCount }).map((_, i) => {
              const currDate = date.subtract({ days: i });
              return (
                <div key={"habitDate" + i} className="w-full text-center py-4">
                  {currDate.toLocaleString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              );
            })}
            {Array.from({ length: colCount }).map((_, i) => (
              <>
                <h4 key={"habitTitle" + i} className="text-left px-4">
                  commit on github
                </h4>
                {Array.from({ length: habitBlockCount }).map((_, j) => (
                  <Checkbox
                    key={"habitCheck" + j}
                    tabIndex={j}
                    className={cn(
                      "h-12 w-16  bg-background-l border-none rounded-none focus-visible:ring-inset focus-visible:ring-offset-0 data-[state=checked]:ring-orange-100 hover:bg-primary-l",
                      {
                        // "bg-background-xl": j % 2 === 0,
                        "bg-secondary": j % 2 === 0,
                        "rounded-tl-md": i === 0 && j === 0,
                        "rounded-bl-md": i === colCount - 1 && j === 0,
                        "rounded-tr-md": i === 0 && j === habitBlockCount - 1,
                        "rounded-br-md":
                          i === colCount - 1 && j === habitBlockCount - 1,
                      },
                    )}
                  />
                ))}
              </>
            ))}
          </section>
        </Card>
      </main>
    </div>
  );
}
