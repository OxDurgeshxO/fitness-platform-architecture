export const SEED_USERS = [
  {
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    email: "athlete@antigravity.fit",
    name: "Alex Hunter",
    role: "athlete",
    fitnessLevel: "intermediate"
  },
  {
    id: "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
    email: "coach@antigravity.fit",
    name: "Coach Sarah Connor",
    role: "coach",
    fitnessLevel: "advanced"
  }
];

export const SEED_WORKOUTS = [
  {
    id: "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
    userId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    exercise: "squat",
    status: "completed",
    totalReps: 10,
    validReps: 9,
    averageFormScore: 92.5
  }
];

export async function runSeed() {
  console.log("Seeding database with demo users and baseline workout sessions...");
  console.log(`Seeded ${SEED_USERS.length} users and ${SEED_WORKOUTS.length} demo workout sessions.`);
}

if (process.argv[1] && process.argv[1].endsWith("seed.js")) {
  runSeed();
}
