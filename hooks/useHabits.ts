import { Habit } from "@/types/dbTypes";
import { getDateInfo } from "@/utils/dateUtils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSQLiteContext } from "expo-sqlite";
import { Alert } from "react-native";

export const useHabits = () => {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  const t = getDateInfo();

  // Get all habits - ORDER BY order field
  const {
    data: habits = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Habit[]>({
    queryKey: ["habits"],
    queryFn: async () => {
      const rows = await db.getAllAsync<Habit>(
        'SELECT * FROM habits WHERE active = 1 ORDER BY "order" ASC, id DESC'
      );
      return rows;
    },
  });

  // Create habit
  const addHabitMutation = useMutation({
    mutationFn: async ({
      name,
      description,
      icon,
      color,
      frequency,
      target,
    }: {
      name: string;
      description?: string;
      icon?: string;
      color?: string;
      frequency?: "daily" | "weekly" | "monthly" | "custom";
      target?: number;
    }) => {
      if (!name.trim()) {
        Alert.alert("Validation", "Habit name cannot be empty.");
        return;
      }

      const createdAt = t.isoTimestamp;

      // Get the maximum order value to set new habit at the end
      const maxOrderResult = await db.getFirstAsync<{ max_order: number }>(
        'SELECT COALESCE(MAX("order"), 0) as max_order FROM habits WHERE active = 1'
      );
      const newOrder = (maxOrderResult?.max_order ?? 0) + 1;

      await db.runAsync(
        'INSERT INTO habits (name, description, icon, color, created_at, frequency, target, active, "order") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          name,
          description ?? "",
          icon ?? "",
          color ?? "",
          createdAt,
          frequency ?? "daily",
          target ?? 0,
          1, // active = 1
          newOrder,
        ]
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      
      queryClient.invalidateQueries({ queryKey: ["habits-entries-today"] });
     
      queryClient.invalidateQueries({ queryKey: ["heatmap-monthly"] });
      queryClient.invalidateQueries({ queryKey: ["heatmap-weekly"] });
      queryClient.invalidateQueries({ queryKey: ["heatmap-overall"] });
    },
    onError: () => {
      Alert.alert("Error", "Failed to create habit. Try again.");
    },
  });

  // Update habit
  const updateHabitMutation = useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      icon,
      color,
      frequency,
      target,
    }: {
      id: number;
      name?: string;
      description?: string;
      icon?: string;
      color?: string;
      frequency?: "daily" | "weekly" | "monthly" | "custom";
      target?: number;
    }) => {
      if (name && !name.trim()) {
        Alert.alert("Validation", "Habit name cannot be empty.");
        return;
      }

      // Build dynamic UPDATE query based on provided fields
      const updates: string[] = [];
      const values: any[] = [];

      if (name !== undefined) {
        updates.push("name = ?");
        values.push(name);
      }
      if (description !== undefined) {
        updates.push("description = ?");
        values.push(description);
      }
      if (icon !== undefined) {
        updates.push("icon = ?");
        values.push(icon);
      }
      if (color !== undefined) {
        updates.push("color = ?");
        values.push(color);
      }
      if (frequency !== undefined) {
        updates.push("frequency = ?");
        values.push(frequency);
      }
      if (target !== undefined) {
        updates.push("target = ?");
        values.push(target);
      }

      if (updates.length === 0) {
        return; // No updates to make
      }

      values.push(id); // Add id for WHERE clause

      await db.runAsync(
        `UPDATE habits SET ${updates.join(", ")} WHERE id = ?`,
        values
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      
      queryClient.invalidateQueries({ queryKey: ["habits-entries-today"] });
      
      queryClient.invalidateQueries({ queryKey: ["heatmap-monthly"] });
      queryClient.invalidateQueries({ queryKey: ["heatmap-weekly"] });
      queryClient.invalidateQueries({ queryKey: ["heatmap-overall"] });
    },
    onError: () => {
      Alert.alert("Error", "Failed to update habit. Try again.");
    },
  });

  // Reorder habits - takes array of habit IDs in new order
  // const reorderHabitsMutation = useMutation({
  //   mutationFn: async (habitIds: number[]) => {
  //     // Update order for each habit based on its position in the array
  //     for (let i = 0; i < habitIds.length; i++) {
  //       await db.runAsync('UPDATE habits SET "order" = ? WHERE id = ?', [
  //         i + 1,
  //         habitIds[i],
  //       ]);
  //     }
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["habits"] });
  //   },
  //   onError: () => {
  //     Alert.alert("Error", "Failed to reorder habits. Try again.");
  //   },
  // });

  // Reorder habits - takes array of habit IDs in new order
  const reorderHabitsMutation = useMutation({
    mutationFn: async (habitIds: number[]) => {
      if (!habitIds || habitIds.length === 0) {
        return;
      }

      // First, ensure the order column exists
      try {
        await db.execAsync(
          'ALTER TABLE habits ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0'
        );
      } catch (error: any) {
        // Column might already exist, that's okay
        if (!error?.message?.includes("duplicate column")) {
          console.log("Order column already exists or error:", error);
        }
      }

      // Update order for each habit
      for (let i = 0; i < habitIds.length; i++) {
        await db.runAsync('UPDATE habits SET "order" = ? WHERE id = ?', [
          i + 1,
          habitIds[i],
        ]);
      }
    },
    onSuccess: () => {
      // Delay invalidation slightly to allow UI animation to complete
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["habits"] });
        
        queryClient.invalidateQueries({ queryKey: ["habits-entries-today"] });
      
        queryClient.invalidateQueries({ queryKey: ["heatmap-monthly"] });
        queryClient.invalidateQueries({ queryKey: ["heatmap-weekly"] });
        queryClient.invalidateQueries({ queryKey: ["heatmap-overall"] });
      }, 200);
    },
    onError: (error) => {
      console.error("Reorder error:", error);
      Alert.alert("Error", "Failed to reorder habits. Try again.");
    },
  });

  // Archive habit (set active = 0)
  const archiveHabitMutation = useMutation({
    mutationFn: async (id: number) => {
      await db.runAsync("UPDATE habits SET active = 0 WHERE id = ?", [id]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      
      queryClient.invalidateQueries({ queryKey: ["habits-entries-today"] });
      
      queryClient.invalidateQueries({ queryKey: ["heatmap-monthly"] });
      queryClient.invalidateQueries({ queryKey: ["heatmap-weekly"] });
      queryClient.invalidateQueries({ queryKey: ["heatmap-overall"] });
    },
    onError: () => {
      Alert.alert("Error", "Failed to archive habit. Try again.");
    },
  });

  // Delete habit
  const deleteHabitMutation = useMutation({
    mutationFn: async (id: number) => {
      await db.runAsync("DELETE FROM habits WHERE id = ?", [id]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
     
      queryClient.invalidateQueries({ queryKey: ["habits-entries-today"] });

      queryClient.invalidateQueries({ queryKey: ["heatmap-monthly"] });
      queryClient.invalidateQueries({ queryKey: ["heatmap-weekly"] });
      queryClient.invalidateQueries({ queryKey: ["heatmap-overall"] });
    },
    onError: () => {
      Alert.alert("Error", "Failed to delete habit. Try again.");
    },
  });

  return {
    habits: habits || [],
    isLoading,
    error,
    refetch,
    addHabit: (data: {
      name: string;
      description?: string;
      icon?: string;
      color?: string;
      frequency?: "daily" | "weekly" | "monthly" | "custom";
      target?: number;
    }) => addHabitMutation.mutate(data),
    updateHabit: (data: {
      id: number;
      name?: string;
      description?: string;
      icon?: string;
      color?: string;
      frequency?: "daily" | "weekly" | "monthly" | "custom";
      target?: number;
    }) => updateHabitMutation.mutate(data),
    reorderHabits: (habitIds: number[]) =>
      reorderHabitsMutation.mutate(habitIds),
    archiveHabit: (id: number) => archiveHabitMutation.mutate(id),
    deleteHabit: (id: number) => deleteHabitMutation.mutate(id),
  };
};
