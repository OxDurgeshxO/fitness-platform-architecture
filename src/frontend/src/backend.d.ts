import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface WorkoutSession {
    id: bigint;
    performanceScore: bigint;
    userId: UserId;
    date: Timestamp;
    reps: bigint;
    exercise: string;
}
export interface DietLog {
    id: bigint;
    fat: bigint;
    meals: Array<string>;
    carbs: bigint;
    userId: UserId;
    date: Timestamp;
    calories: bigint;
    protein: bigint;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type UserId = Principal;
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface HabitTracker {
    completedDays: Array<Timestamp>;
    workoutSchedule: Array<string>;
    userId: UserId;
    streakCount: bigint;
}
export interface CoachSelection {
    selectedCoachId: bigint;
    userId: UserId;
}
export interface ChatMessage {
    id: bigint;
    content: string;
    sender: string;
    timestamp: Timestamp;
}
export interface UserProfile {
    age: bigint;
    bmi: number;
    weight: bigint;
    height: bigint;
    fitnessGoals: Array<string>;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createChatMessage(message: ChatMessage): Promise<bigint>;
    createCoachSelection(userId: UserId, selection: CoachSelection): Promise<void>;
    createDietLog(log: DietLog): Promise<bigint>;
    createHabitTracker(userId: UserId, tracker: HabitTracker): Promise<void>;
    createUserProfile(profile: UserProfile): Promise<void>;
    createWorkoutSession(session: WorkoutSession): Promise<bigint>;
    deleteChatMessage(id: bigint): Promise<void>;
    deleteCoachSelection(userId: UserId): Promise<void>;
    deleteDietLog(id: bigint): Promise<void>;
    deleteHabitTracker(userId: UserId): Promise<void>;
    deleteUserProfile(userId: UserId): Promise<void>;
    deleteWorkoutSession(id: bigint): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getChatMessage(id: bigint): Promise<ChatMessage | null>;
    getCoachSelection(userId: UserId): Promise<CoachSelection | null>;
    getDietLog(id: bigint): Promise<DietLog | null>;
    getHabitTracker(userId: UserId): Promise<HabitTracker | null>;
    getUserProfile(userId: UserId): Promise<UserProfile | null>;
    getWorkoutSession(id: bigint): Promise<WorkoutSession | null>;
    isCallerAdmin(): Promise<boolean>;
    listChatMessages(): Promise<Array<ChatMessage>>;
    listDietLogsByUser(userId: UserId): Promise<Array<DietLog>>;
    listWorkoutSessionsByUser(userId: UserId): Promise<Array<WorkoutSession>>;
    sendVirtualGymBuddyMessage(message: string): Promise<string>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCoachSelection(userId: UserId, selection: CoachSelection): Promise<void>;
    updateDietLog(id: bigint, log: DietLog): Promise<void>;
    updateHabitTracker(userId: UserId, tracker: HabitTracker): Promise<void>;
    updateUserProfile(userId: UserId, profile: UserProfile): Promise<void>;
    updateWorkoutSession(id: bigint, session: WorkoutSession): Promise<void>;
}
