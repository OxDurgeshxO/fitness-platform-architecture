import _Map "mo:core/Map";
import _Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinViews "mo:caffeineai-data-viewer/MixinViews";
import _Types "types/fitness";
import _Common "types/common";
import FitnessLib "lib/fitness";
import FitnessMixin "mixins/fitness-api";

actor {
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  let fitnessState : FitnessLib.FitnessState;
  include FitnessMixin(accessControlState, fitnessState);

  include MixinViews();
};
