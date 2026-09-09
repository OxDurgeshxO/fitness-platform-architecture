import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Types "../types/fitness";
import Common "../types/common";

module {
  public type FitnessState = {
    userProfiles : Map.Map<Common.UserId, Types.UserProfile>;
    workoutSessions : Map.Map<Nat, Types.WorkoutSession>;
    dietLogs : Map.Map<Nat, Types.DietLog>;
    habitTrackers : Map.Map<Common.UserId, Types.HabitTracker>;
    chatMessages : Map.Map<Nat, Types.ChatMessage>;
    coachSelections : Map.Map<Common.UserId, Types.CoachSelection>;
    var nextWorkoutId : Nat;
    var nextDietLogId : Nat;
    var nextChatMessageId : Nat;
  };

  public func initState() : FitnessState {
    {
      userProfiles = Map.empty<Common.UserId, Types.UserProfile>();
      workoutSessions = Map.empty<Nat, Types.WorkoutSession>();
      dietLogs = Map.empty<Nat, Types.DietLog>();
      habitTrackers = Map.empty<Common.UserId, Types.HabitTracker>();
      chatMessages = Map.empty<Nat, Types.ChatMessage>();
      coachSelections = Map.empty<Common.UserId, Types.CoachSelection>();
      var nextWorkoutId = 0;
      var nextDietLogId = 0;
      var nextChatMessageId = 0;
    };
  };

  // UserProfile CRUD
  public func createUserProfile(state : FitnessState, userId : Common.UserId, profile : Types.UserProfile) : () {
    state.userProfiles.add(userId, profile);
  };

  public func getUserProfile(state : FitnessState, userId : Common.UserId) : ?Types.UserProfile {
    state.userProfiles.get(userId);
  };

  public func updateUserProfile(state : FitnessState, userId : Common.UserId, profile : Types.UserProfile) : () {
    state.userProfiles.add(userId, profile);
  };

  public func deleteUserProfile(state : FitnessState, userId : Common.UserId) : () {
    state.userProfiles.remove(userId);
  };

  // WorkoutSession CRUD
  public func createWorkoutSession(state : FitnessState, session : Types.WorkoutSession) : Nat {
    let id = state.nextWorkoutId;
    state.nextWorkoutId += 1;
    let sessionWithId = { session with id };
    state.workoutSessions.add(id, sessionWithId);
    id;
  };

  public func getWorkoutSession(state : FitnessState, id : Nat) : ?Types.WorkoutSession {
    state.workoutSessions.get(id);
  };

  public func updateWorkoutSession(state : FitnessState, id : Nat, session : Types.WorkoutSession) : () {
    state.workoutSessions.add(id, session);
  };

  public func deleteWorkoutSession(state : FitnessState, id : Nat) : () {
    state.workoutSessions.remove(id);
  };

  public func listWorkoutSessionsByUser(state : FitnessState, userId : Common.UserId) : [Types.WorkoutSession] {
    let all = state.workoutSessions.entries();
    let filtered = all.filter(func((_, s)) { Principal.equal(s.userId, userId) });
    filtered.map<(Nat, Types.WorkoutSession), Types.WorkoutSession>(func((_, s)) { s }).toArray();
  };

  // DietLog CRUD
  public func createDietLog(state : FitnessState, log : Types.DietLog) : Nat {
    let id = state.nextDietLogId;
    state.nextDietLogId += 1;
    let logWithId = { log with id };
    state.dietLogs.add(id, logWithId);
    id;
  };

  public func getDietLog(state : FitnessState, id : Nat) : ?Types.DietLog {
    state.dietLogs.get(id);
  };

  public func updateDietLog(state : FitnessState, id : Nat, log : Types.DietLog) : () {
    state.dietLogs.add(id, log);
  };

  public func deleteDietLog(state : FitnessState, id : Nat) : () {
    state.dietLogs.remove(id);
  };

  public func listDietLogsByUser(state : FitnessState, userId : Common.UserId) : [Types.DietLog] {
    let all = state.dietLogs.entries();
    let filtered = all.filter(func((_, l)) { Principal.equal(l.userId, userId) });
    filtered.map<(Nat, Types.DietLog), Types.DietLog>(func((_, l)) { l }).toArray();
  };

  // HabitTracker CRUD
  public func createHabitTracker(state : FitnessState, userId : Common.UserId, tracker : Types.HabitTracker) : () {
    state.habitTrackers.add(userId, tracker);
  };

  public func getHabitTracker(state : FitnessState, userId : Common.UserId) : ?Types.HabitTracker {
    state.habitTrackers.get(userId);
  };

  public func updateHabitTracker(state : FitnessState, userId : Common.UserId, tracker : Types.HabitTracker) : () {
    state.habitTrackers.add(userId, tracker);
  };

  public func deleteHabitTracker(state : FitnessState, userId : Common.UserId) : () {
    state.habitTrackers.remove(userId);
  };

  // ChatMessage CRUD
  public func createChatMessage(state : FitnessState, message : Types.ChatMessage) : Nat {
    let id = state.nextChatMessageId;
    state.nextChatMessageId += 1;
    let messageWithId = { message with id };
    state.chatMessages.add(id, messageWithId);
    id;
  };

  public func getChatMessage(state : FitnessState, id : Nat) : ?Types.ChatMessage {
    state.chatMessages.get(id);
  };

  public func listChatMessages(state : FitnessState) : [Types.ChatMessage] {
    let all = state.chatMessages.entries();
    all.map<(Nat, Types.ChatMessage), Types.ChatMessage>(func((_, m)) { m }).toArray();
  };

  public func deleteChatMessage(state : FitnessState, id : Nat) : () {
    state.chatMessages.remove(id);
  };

  // CoachSelection CRUD
  public func createCoachSelection(state : FitnessState, userId : Common.UserId, selection : Types.CoachSelection) : () {
    state.coachSelections.add(userId, selection);
  };

  public func getCoachSelection(state : FitnessState, userId : Common.UserId) : ?Types.CoachSelection {
    state.coachSelections.get(userId);
  };

  public func updateCoachSelection(state : FitnessState, userId : Common.UserId, selection : Types.CoachSelection) : () {
    state.coachSelections.add(userId, selection);
  };

  public func deleteCoachSelection(state : FitnessState, userId : Common.UserId) : () {
    state.coachSelections.remove(userId);
  };

  // Virtual Gym Buddy - rule-based mock response
  public func getVirtualGymBuddyResponse(_state : FitnessState, message : Text) : Text {
    if (message == "workout" or message == "exercise" or message == "Workout" or message == "Exercise") {
      "Great question! For your fitness goals, I recommend a mix of strength training and cardio. Try 3 sets of 12 reps for compound movements like squats and deadlifts, followed by 20 minutes of HIIT cardio."
    } else if (message == "diet" or message == "nutrition" or message == "food" or message == "eat" or message == "Diet" or message == "Nutrition" or message == "Food" or message == "Eat") {
      "Nutrition is key! Focus on lean proteins, complex carbs, and healthy fats. Aim for 1.6-2.2g of protein per kg of body weight. Would you like a personalized meal plan?"
    } else if (message == "motivation" or message == "tired" or message == "lazy" or message == "skip" or message == "Motivation" or message == "Tired" or message == "Lazy" or message == "Skip") {
      "I hear you! Remember, consistency beats intensity. Even a 15-minute workout is better than none. You've got this! Let's start with something light to get you moving."
    } else if (message == "hello" or message == "hi" or message == "hey" or message == "Hello" or message == "Hi" or message == "Hey") {
      "Hello! I'm your Virtual Gym Buddy. I'm here to help with workouts, nutrition, and keeping you motivated. What would you like to talk about today?"
    } else if (message == "bmi" or message == "weight" or message == "height" or message == "BMI" or message == "Weight" or message == "Height") {
      "BMI is a useful starting point, but it's not the whole picture. Focus on body composition, strength, and how you feel. Would you like tips on healthy weight management?"
    } else if (message == "habit" or message == "streak" or message == "routine" or message == "Habit" or message == "Streak" or message == "Routine") {
      "Building habits is about small, consistent steps. Try habit stacking: attach a new habit to an existing one. For example, do 10 push-ups right after brushing your teeth!"
    } else {
      "That's an interesting question! As your Virtual Gym Buddy, I can help with workout plans, nutrition advice, motivation, and tracking your progress. What specifically would you like to know?"
    };
  };
}
