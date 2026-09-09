import Common "common";

module {
  public type UserProfile = {
    name : Text;
    age : Nat;
    weight : Nat;
    height : Nat;
    bmi : Float;
    fitnessGoals : [Text];
  };

  public type WorkoutSession = {
    id : Nat;
    userId : Common.UserId;
    date : Common.Timestamp;
    exercise : Text;
    reps : Nat;
    performanceScore : Nat;
  };

  public type DietLog = {
    id : Nat;
    userId : Common.UserId;
    date : Common.Timestamp;
    meals : [Text];
    calories : Nat;
    protein : Nat;
    carbs : Nat;
    fat : Nat;
  };

  public type HabitTracker = {
    userId : Common.UserId;
    workoutSchedule : [Text];
    streakCount : Nat;
    completedDays : [Common.Timestamp];
  };

  public type ChatMessage = {
    id : Nat;
    sender : Text;
    content : Text;
    timestamp : Common.Timestamp;
  };

  public type CoachSelection = {
    userId : Common.UserId;
    selectedCoachId : Nat;
  };
}
