import { invoke } from "@tauri-apps/api/tauri";
import { Habit } from "src-tauri/bindings/Habit";
import { HabitEntry } from "src-tauri/bindings/HabitEntry";
import { HabitType } from "src-tauri/bindings/HabitType";

export type DefaultValueOmits = "id" | "creation_timestamp";
export type HabitValues = Omit<Habit, DefaultValueOmits>;
export type HabitEntryValues = Omit<HabitEntry, DefaultValueOmits>;

export async function createHabit(habitValues: HabitValues) {
  const { name, habit_type, target, is_positive, is_archived  } = habitValues;

  return invoke("create_habit", {
    name,
    habitType: habit_type,
    target,
    isPositive: is_positive,
    isArchived: is_archived,
  })
}

export async function createHabitEntry(habitEntryValues: HabitEntryValues) {
  invoke("create_habit_entry", {
    habitId: habitEntryValues.habit_id,
    value: habitEntryValues.value,
    completionDate: habitEntryValues.completion_date,
  });
}

export function deleteHabitEntry(habitEntry: HabitEntry) {
  return invoke("delete_habit_entry", {
    habitEntryId: habitEntry.id,
  });
}
