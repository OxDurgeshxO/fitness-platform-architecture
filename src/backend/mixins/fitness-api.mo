import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Types "../types/fitness";
import Common "../types/common";
import FitnessLib "../lib/fitness";

mixin (
  accessControlState : AccessControl.AccessControlState,
  fitnessState : FitnessLib.FitnessState,
) {
  // HTTP outcalls transform callback
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // UserProfile API
  public shared ({ caller }) func createUserProfile(profile : Types.UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    FitnessLib.createUserProfile(fitnessState, caller, profile);
  };

  public query ({ caller }) func getUserProfile(userId : Common.UserId) : async ?Types.UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    FitnessLib.getUserProfile(fitnessState, userId);
  };

  public shared ({ caller }) func updateUserProfile(userId : Common.UserId, profile : Types.UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only update your own profile");
    };
    FitnessLib.updateUserProfile(fitnessState, userId, profile);
  };

  public shared ({ caller }) func deleteUserProfile(userId : Common.UserId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete profiles");
    };
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only delete your own profile");
    };
    FitnessLib.deleteUserProfile(fitnessState, userId);
  };

  // WorkoutSession API
  public shared ({ caller }) func createWorkoutSession(session : Types.WorkoutSession) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create workout sessions");
    };
    let sessionWithUser = { session with userId = caller };
    FitnessLib.createWorkoutSession(fitnessState, sessionWithUser);
  };

  public query ({ caller }) func getWorkoutSession(id : Nat) : async ?Types.WorkoutSession {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view workout sessions");
    };
    FitnessLib.getWorkoutSession(fitnessState, id);
  };

  public shared ({ caller }) func updateWorkoutSession(id : Nat, session : Types.WorkoutSession) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update workout sessions");
    };
    FitnessLib.updateWorkoutSession(fitnessState, id, session);
  };

  public shared ({ caller }) func deleteWorkoutSession(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete workout sessions");
    };
    FitnessLib.deleteWorkoutSession(fitnessState, id);
  };

  public query ({ caller }) func listWorkoutSessionsByUser(userId : Common.UserId) : async [Types.WorkoutSession] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can list workout sessions");
    };
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own workout sessions");
    };
    FitnessLib.listWorkoutSessionsByUser(fitnessState, userId);
  };

  // DietLog API
  public shared ({ caller }) func createDietLog(log : Types.DietLog) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create diet logs");
    };
    let logWithUser = { log with userId = caller };
    FitnessLib.createDietLog(fitnessState, logWithUser);
  };

  public query ({ caller }) func getDietLog(id : Nat) : async ?Types.DietLog {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view diet logs");
    };
    FitnessLib.getDietLog(fitnessState, id);
  };

  public shared ({ caller }) func updateDietLog(id : Nat, log : Types.DietLog) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update diet logs");
    };
    FitnessLib.updateDietLog(fitnessState, id, log);
  };

  public shared ({ caller }) func deleteDietLog(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete diet logs");
    };
    FitnessLib.deleteDietLog(fitnessState, id);
  };

  public query ({ caller }) func listDietLogsByUser(userId : Common.UserId) : async [Types.DietLog] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can list diet logs");
    };
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own diet logs");
    };
    FitnessLib.listDietLogsByUser(fitnessState, userId);
  };

  // HabitTracker API
  public shared ({ caller }) func createHabitTracker(userId : Common.UserId, tracker : Types.HabitTracker) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create habit trackers");
    };
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only create your own habit tracker");
    };
    FitnessLib.createHabitTracker(fitnessState, userId, tracker);
  };

  public query ({ caller }) func getHabitTracker(userId : Common.UserId) : async ?Types.HabitTracker {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view habit trackers");
    };
    FitnessLib.getHabitTracker(fitnessState, userId);
  };

  public shared ({ caller }) func updateHabitTracker(userId : Common.UserId, tracker : Types.HabitTracker) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update habit trackers");
    };
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only update your own habit tracker");
    };
    FitnessLib.updateHabitTracker(fitnessState, userId, tracker);
  };

  public shared ({ caller }) func deleteHabitTracker(userId : Common.UserId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete habit trackers");
    };
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only delete your own habit tracker");
    };
    FitnessLib.deleteHabitTracker(fitnessState, userId);
  };

  // ChatMessage API
  public shared ({ caller }) func createChatMessage(message : Types.ChatMessage) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create chat messages");
    };
    let messageWithSender = { message with sender = caller.toText() };
    FitnessLib.createChatMessage(fitnessState, messageWithSender);
  };

  public query ({ caller }) func getChatMessage(id : Nat) : async ?Types.ChatMessage {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view chat messages");
    };
    FitnessLib.getChatMessage(fitnessState, id);
  };

  public query ({ caller }) func listChatMessages() : async [Types.ChatMessage] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can list chat messages");
    };
    FitnessLib.listChatMessages(fitnessState);
  };

  public shared ({ caller }) func deleteChatMessage(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete chat messages");
    };
    FitnessLib.deleteChatMessage(fitnessState, id);
  };

  // CoachSelection API
  public shared ({ caller }) func createCoachSelection(userId : Common.UserId, selection : Types.CoachSelection) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create coach selections");
    };
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only create your own coach selection");
    };
    FitnessLib.createCoachSelection(fitnessState, userId, selection);
  };

  public query ({ caller }) func getCoachSelection(userId : Common.UserId) : async ?Types.CoachSelection {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view coach selections");
    };
    FitnessLib.getCoachSelection(fitnessState, userId);
  };

  public shared ({ caller }) func updateCoachSelection(userId : Common.UserId, selection : Types.CoachSelection) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update coach selections");
    };
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only update your own coach selection");
    };
    FitnessLib.updateCoachSelection(fitnessState, userId, selection);
  };

  public shared ({ caller }) func deleteCoachSelection(userId : Common.UserId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete coach selections");
    };
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only delete your own coach selection");
    };
    FitnessLib.deleteCoachSelection(fitnessState, userId);
  };

  // Virtual Gym Buddy API
  public shared ({ caller }) func sendVirtualGymBuddyMessage(message : Text) : async Text {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };
    
    // Save user message
    let userMessage : Types.ChatMessage = {
      id = 0;
      sender = caller.toText();
      content = message;
      timestamp = 0;
    };
    ignore FitnessLib.createChatMessage(fitnessState, userMessage);
    
    // Generate rule-based response
    let response = FitnessLib.getVirtualGymBuddyResponse(fitnessState, message);
    
    // Save bot response
    let botMessage : Types.ChatMessage = {
      id = 0;
      sender = "Virtual Gym Buddy";
      content = response;
      timestamp = 0;
    };
    ignore FitnessLib.createChatMessage(fitnessState, botMessage);
    
    response;
  };
}
