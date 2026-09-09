import Map "mo:core/Map";
module {
  type OldActor = {};

  type NewActor = {
    var accessControlState : {
      var adminAssigned : Bool;
      userRoles : Map.Map<Principal, { #admin; #user; #guest }>;
    };
    var fitnessState : {
      userProfiles : Map.Map<Principal, {
        name : Text;
        age : Nat;
        weight : Nat;
        height : Nat;
        bmi : Float;
        fitnessGoals : [Text];
      }>;
      workoutSessions : Map.Map<Nat, {
        id : Nat;
        userId : Principal;
        date : Nat;
        exercise : Text;
        reps : Nat;
        performanceScore : Nat;
      }>;
      dietLogs : Map.Map<Nat, {
        id : Nat;
        userId : Principal;
        date : Nat;
        meals : [Text];
        calories : Nat;
        protein : Nat;
        carbs : Nat;
        fat : Nat;
      }>;
      habitTrackers : Map.Map<Principal, {
        userId : Principal;
        workoutSchedule : [Text];
        streakCount : Nat;
        completedDays : [Nat];
      }>;
      chatMessages : Map.Map<Nat, {
        id : Nat;
        sender : Text;
        content : Text;
        timestamp : Nat;
      }>;
      coachSelections : Map.Map<Principal, {
        userId : Principal;
        selectedCoachId : Nat;
      }>;
      var nextWorkoutId : Nat;
      var nextDietLogId : Nat;
      var nextChatMessageId : Nat;
    };
  };

  public func migration(_old : OldActor) : NewActor {
    {
      var accessControlState = {
        var adminAssigned = false;
        userRoles = Map.empty<Principal, { #admin; #user; #guest }>();
      };
      var fitnessState = {
        userProfiles = Map.empty<Principal, {
          name : Text;
          age : Nat;
          weight : Nat;
          height : Nat;
          bmi : Float;
          fitnessGoals : [Text];
        }>();
        workoutSessions = Map.empty<Nat, {
          id : Nat;
          userId : Principal;
          date : Nat;
          exercise : Text;
          reps : Nat;
          performanceScore : Nat;
        }>();
        dietLogs = Map.empty<Nat, {
          id : Nat;
          userId : Principal;
          date : Nat;
          meals : [Text];
          calories : Nat;
          protein : Nat;
          carbs : Nat;
          fat : Nat;
        }>();
        habitTrackers = Map.empty<Principal, {
          userId : Principal;
          workoutSchedule : [Text];
          streakCount : Nat;
          completedDays : [Nat];
        }>();
        chatMessages = Map.empty<Nat, {
          id : Nat;
          sender : Text;
          content : Text;
          timestamp : Nat;
        }>();
        coachSelections = Map.empty<Principal, {
          userId : Principal;
          selectedCoachId : Nat;
        }>();
        var nextWorkoutId = 0;
        var nextDietLogId = 0;
        var nextChatMessageId = 0;
      };
    };
  };
}
