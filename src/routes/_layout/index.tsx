import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Temporal } from "@js-temporal/polyfill";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { HabitEntry } from "src-tauri/bindings/HabitEntry";
import { HabitWithEntries } from "src-tauri/bindings/HabitWithEntries";
import { toast } from "sonner";
import { Habit } from "src-tauri/bindings/Habit";
import {
  deleteHabitEntry,
  createHabit,
  createHabitEntry,
  HabitEntryValues,
} from "@/lib/tauri";

export const Route = createFileRoute("/_layout/")({
  component: Index,
});

const habitTitleMinWidth = 160;

function Index() {
  const habitGridRef = useRef<HTMLDivElement>(null);
  const date = Temporal.Now.plainDateISO();
  const [habitBlockCount, setHabitBlockCount] = useState(0);
  const [habitTitleWidth, setHabitTitleWidth] = useState(habitTitleMinWidth);
  const [habitsWithEntries, setHabitsWithEntries] = useState<
    HabitWithEntries[]
  >([]);

  function updateHabitEntries() {
    invoke("get_all_habits_with_entries").then((res) => {
      const resData = JSON.parse(res as string);
      console.log(resData);
      setHabitsWithEntries(resData);
    });
  }

  useEffect(() => {
    updateHabitEntries();

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
  }, []);

  async function handleCreateHabitEntry(habit: HabitEntryValues) {
    toast.promise(createHabitEntry(habit), {
      loading: "Creating Habit Entry",
      success: `Entry of ${habit} created`,
      error: (err) => `${err}`,
    });
  }

  async function handleDeleteHabitEntry(habit: Habit, habitEntry: HabitEntry) {
    toast.promise(deleteHabitEntry(habitEntry), {
      loading: "Deleting Habit Entry",
      success: `Entry of ${habit?.name} deleted`,
      error: (err) => `${err}`,
    });
  }

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
            <Button
              className="my-auto mb-3 mr-8"
              onClick={() =>
                createHabit({
                  // defualts values for now
                  name: "Commit To Github",
                  habit_type: "Binary",
                  target: 1,
                  is_positive: true,
                  is_archived: false,
                })
              }
            >
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
            {habitsWithEntries.map(({ habit, entries }, i) => {
              if (habit.is_archived) return null;

              return (
                <>
                  <h4 key={"habitTitle" + i} className="pr-8 text-left">
                    {habit.name}
                  </h4>
                  {Array.from({ length: habitBlockCount }).map((_, j) => {
                    const currDate = date.subtract({ days: j });
                    const currentEntry = entries.find(
                      (entry) => entry.completion_date === currDate.toString(),
                    );
                    console.log(currentEntry);

                    return (
                      <Checkbox
                        key={"habitCheck" + j}
                        checked={!!currentEntry}
                        tabIndex={j}
                        onClick={() => {
                          if (!currentEntry) {
                            return handleCreateHabitEntry({
                              habit_id: habit.id,
                              value: 1,
                              completion_date: currDate.toString(),
                            });
                          }
                          handleDeleteHabitEntry(habit, currentEntry);
                        }}
                        className={cn(
                          `h-12 w-16 rounded-none border-none bg-background-l
                          hover:bg-primary-l focus-visible:ring-inset
                          focus-visible:ring-offset-0
                          data-[state=checked]:ring-orange-100`,
                          {
                            "bg-background-xl": j % 2 === 0,
                            "rounded-tl-md": i === 0 && j === 0,
                            "rounded-bl-md":
                              i === habitsWithEntries.length - 1 && j === 0,
                            "rounded-tr-md":
                              i === 0 && j === habitBlockCount - 1,
                            "rounded-br-md":
                              i === habitsWithEntries.length - 1 &&
                              j === habitBlockCount - 1,
                          },
                        )}
                      />
                    );
                  })}
                </>
              );
            })}
          </section>
        </Card>
      </main>
    </div>
  );
}
