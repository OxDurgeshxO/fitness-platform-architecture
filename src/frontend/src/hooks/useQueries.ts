import { createActor } from "@/backend";
import type {
  ChatMessage,
  CoachSelection,
  DietLog,
  HabitTracker,
  UserId,
  UserProfile,
  WorkoutSession,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// User Profile
export function useUserProfile(userId: UserId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["userProfile", userId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(userId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateUserProfile() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// Workout Sessions
export function useWorkoutSessions(userId: UserId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["workoutSessions", userId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkoutSessionsByUser(userId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateWorkoutSession() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (session: WorkoutSession) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createWorkoutSession(session);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["workoutSessions", vars.userId.toString()],
      });
    },
  });
}

// Diet Logs
export function useDietLogs(userId: UserId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["dietLogs", userId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listDietLogsByUser(userId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateDietLog() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (log: DietLog) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createDietLog(log);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["dietLogs", vars.userId.toString()],
      });
    },
  });
}

// Habit Tracker
export function useHabitTracker(userId: UserId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["habitTracker", userId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getHabitTracker(userId);
    },
    enabled: !!actor && !isFetching,
  });
}

// Coach Selection
export function useCoachSelection(userId: UserId) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["coachSelection", userId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCoachSelection(userId);
    },
    enabled: !!actor && !isFetching,
  });
}

// Chat Messages (Gym Buddy)
export function useChatMessages() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["chatMessages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listChatMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendGymBuddyMessage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (message: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.sendVirtualGymBuddyMessage(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatMessages"] });
    },
  });
}

// User Role
export function useCallerUserRole() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["callerUserRole"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
