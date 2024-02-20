import { invoke } from "@tauri-apps/api/tauri";
import { Habit } from "src-tauri/bindings/Habit";
import { HabitEntry } from "src-tauri/bindings/HabitEntry";

export type DefaultValueOmits = "id" | "creation_timestamp";
export type HabitValues = Omit<Habit, DefaultValueOmits>;
export type HabitEntryValues = Omit<HabitEntry, DefaultValueOmits>;

export async function createHabit(habitValues: HabitValues) {
  return invoke("create_habit", {serializedHabitValues: JSON.stringify(habitValues)});
}

export async function createHabitEntry(habitEntryValues: HabitEntryValues) {
  invoke("create_habit_entry", {
    habitId: habitEntryValues.habit_id,
    value: habitEntryValues.value,
    completionDate: habitEntryValues.completion_date,
  });
}

export async function deleteHabitEntry(habitEntry: HabitEntry) {
  return invoke("delete_habit_entry", {
    habitEntryId: habitEntry.id,
  });
}
