import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Temporal } from "@js-temporal/polyfill";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Habit } from "src-tauri/bindings/Habit";

export const Route = createFileRoute("/_layout/")({
  component: Index,
});

const habitTitleMinWidth = 160;
const colCount = 16;

function addHabit() {
  invoke("create_habit", { habitName: "Commit To Github" }).then((res) => {
    const resData = JSON.parse(res as string);

    console.log(resData);
  });
}

function Index() {
  const habitGridRef = useRef<HTMLDivElement>(null);
  const date = Temporal.Now.plainDateISO();
  const [habitBlockCount, setHabitBlockCount] = useState(0);
  const [habitTitleWidth, setHabitTitleWidth] = useState(habitTitleMinWidth);
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    invoke("get_all_habits").then((res) => {
      const resData = JSON.parse(res as string);

      setHabits(resData);
    });

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
      <main className="py-8">
        <Card className="px-12 py-10">
          <section
            ref={habitGridRef}
            className={"mx-auto grid w-full items-center text-zinc-400"}
            style={{
              gridTemplateColumns: `${habitTitleWidth}px repeat(auto-fill, 64px)`,
            }}
          >
            <Button className="my-auto mb-3 mr-8" onClick={addHabit}>
              Add Habit
            </Button>
            {Array.from({ length: habitBlockCount }).map((_, i) => {
              const currDate = date.subtract({ days: i });
              return (
                <div key={"habitDate" + i} className="w-full pb-4 text-center">
                  {currDate.toLocaleString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              );
            })}
            {habits.map((habit, i) => {
              if (habit.is_archived) return null;
              return <>
                <h4 key={"habitTitle" + i} className="pr-8 text-left">
                  {habit.name}
                  
                </h4>
                {Array.from({ length: habitBlockCount }).map((_, j) => (
                  <Checkbox
                    key={"habitCheck" + j}
                    tabIndex={j}
                    className={cn(
                      `h-12 w-16 rounded-none border-none bg-background-l
                      hover:bg-primary-l focus-visible:ring-inset
                      focus-visible:ring-offset-0
                      data-[state=checked]:ring-orange-100`,
                      {
                        "bg-background-xl": j % 2 === 0,
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
            })}
          </section>
        </Card>
      </main>
    </div>
  );
}
