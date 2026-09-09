import { GlassCard } from "@/components/GlassCard";
import { NeonBadge } from "@/components/NeonBadge";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Clock,
  Dumbbell,
  Heart,
  LocateFixed,
  MapPin,
  Navigation,
  ShieldCheck,
  Star,
  Trophy,
  Users,
  Waves,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

interface Gym {
  id: number;
  name: string;
  distance: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  open: boolean;
  openHours: string;
  imageGradient: string;
}

interface WorkoutProgram {
  id: number;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  sessionsPerWeek: number;
  tags: string[];
  color: "cyan" | "purple" | "green" | "orange";
}

interface FitnessChallenge {
  id: number;
  title: string;
  description: string;
  duration: string;
  participants: number;
  reward: string;
  joined: boolean;
  color: "cyan" | "purple" | "green" | "orange";
}

const DEFAULT_LAT = 40.7128;
const DEFAULT_LNG = -74.006;

const gymsData: Gym[] = [
  {
    id: 1,
    name: "Iron Forge Gym",
    distance: 0.8,
    rating: 4.8,
    reviewCount: 342,
    amenities: ["Strength", "24/7", "Sauna", "Parking"],
    open: true,
    openHours: "Open 24 hours",
    imageGradient: "from-primary/20 to-accent/10",
  },
  {
    id: 2,
    name: "Pulse Fitness",
    distance: 1.2,
    rating: 4.6,
    reviewCount: 218,
    amenities: ["Cardio", "Classes", "Pool", "Cafe"],
    open: true,
    openHours: "5:00 AM – 11:00 PM",
    imageGradient: "from-accent/20 to-chart-3/10",
  },
  {
    id: 3,
    name: "Zenith Athletics",
    distance: 2.1,
    rating: 4.9,
    reviewCount: 156,
    amenities: ["CrossFit", "Pool", "Boxing", "Childcare"],
    open: false,
    openHours: "6:00 AM – 10:00 PM",
    imageGradient: "from-chart-3/20 to-primary/10",
  },
  {
    id: 4,
    name: "Velocity Sports Club",
    distance: 2.8,
    rating: 4.4,
    reviewCount: 189,
    amenities: ["Basketball", "Track", "Climbing", "Yoga"],
    open: true,
    openHours: "5:30 AM – 10:30 PM",
    imageGradient: "from-chart-4/20 to-primary/10",
  },
];

const workoutPrograms: WorkoutProgram[] = [
  {
    id: 1,
    title: "Beginner Strength",
    description:
      "Build foundational strength with progressive overload. Perfect for newcomers to resistance training.",
    difficulty: "Beginner",
    duration: "8 weeks",
    sessionsPerWeek: 3,
    tags: ["Strength", "Full Body"],
    color: "cyan",
  },
  {
    id: 2,
    title: "HIIT Blast",
    description:
      "High-intensity interval training to maximize calorie burn and cardiovascular fitness in minimal time.",
    difficulty: "Intermediate",
    duration: "6 weeks",
    sessionsPerWeek: 4,
    tags: ["Cardio", "Fat Loss"],
    color: "purple",
  },
  {
    id: 3,
    title: "Yoga Flow",
    description:
      "Improve flexibility, balance, and mindfulness with guided vinyasa and hatha sequences.",
    difficulty: "Beginner",
    duration: "12 weeks",
    sessionsPerWeek: 3,
    tags: ["Flexibility", "Recovery"],
    color: "green",
  },
  {
    id: 4,
    title: "Powerlifting Prep",
    description:
      "Specialized program for squat, bench, and deadlift. Designed for competition readiness.",
    difficulty: "Advanced",
    duration: "16 weeks",
    sessionsPerWeek: 4,
    tags: ["Strength", "Competition"],
    color: "orange",
  },
];

const fitnessChallenges: FitnessChallenge[] = [
  {
    id: 1,
    title: "30-Day Push-Up Challenge",
    description:
      "Progress from 10 to 100 push-ups daily. Track reps and earn streak badges.",
    duration: "30 days",
    participants: 1247,
    reward: "Push-Up Pro Badge",
    joined: false,
    color: "cyan",
  },
  {
    id: 2,
    title: "Marathon Prep",
    description:
      "16-week guided running plan with pace tracking and weekly mileage goals.",
    duration: "16 weeks",
    participants: 856,
    reward: "Marathon Finisher Medal",
    joined: true,
    color: "purple",
  },
  {
    id: 3,
    title: "Plank Mastery",
    description:
      "Hold planks longer each day. Core strength challenge with leaderboard rankings.",
    duration: "21 days",
    participants: 2103,
    reward: "Iron Core Badge",
    joined: false,
    color: "green",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={`star-${i}-${Math.floor(rating)}`}
          className={`h-3.5 w-3.5 ${
            i < Math.floor(rating)
              ? "fill-chart-4 text-chart-4"
              : i < rating
                ? "fill-chart-4/50 text-chart-4/50"
                : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

function AmenityIcon({ amenity }: { amenity: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    Strength: <Dumbbell className="h-3 w-3" />,
    "24/7": <Clock className="h-3 w-3" />,
    Sauna: <Waves className="h-3 w-3" />,
    Parking: <MapPin className="h-3 w-3" />,
    Cardio: <Heart className="h-3 w-3" />,
    Classes: <Users className="h-3 w-3" />,
    Pool: <Waves className="h-3 w-3" />,
    Cafe: <Zap className="h-3 w-3" />,
    CrossFit: <Zap className="h-3 w-3" />,
    Boxing: <ShieldCheck className="h-3 w-3" />,
    Childcare: <Users className="h-3 w-3" />,
    Basketball: <Users className="h-3 w-3" />,
    Track: <Navigation className="h-3 w-3" />,
    Climbing: <MapPin className="h-3 w-3" />,
    Yoga: <Heart className="h-3 w-3" />,
  };
  return <>{iconMap[amenity] || <Zap className="h-3 w-3" />}</>;
}

function DifficultyBadge({ level }: { level: string }) {
  const colorMap: Record<string, "cyan" | "purple" | "green" | "orange"> = {
    Beginner: "green",
    Intermediate: "cyan",
    Advanced: "orange",
  };
  return <NeonBadge color={colorMap[level] || "cyan"}>{level}</NeonBadge>;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

export function RecommenderPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "granted" | "denied"
  >("idle");
  const [cityName, setCityName] = useState("New York, NY");
  const [joinedChallenges, setJoinedChallenges] = useState<Set<number>>(
    new Set([2]),
  );

  const requestLocation = useCallback(() => {
    setLocationStatus("loading");
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus("granted");
        setCityName("Your Location");
      },
      () => {
        setLocation({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
        setLocationStatus("denied");
        setCityName("New York, NY (Default)");
      },
      { timeout: 10000 },
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const toggleChallenge = (id: number) => {
    setJoinedChallenges((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Gym Recommender & Planner"
        subtitle="Discover nearby gyms, personalized workout programs, and fitness challenges"
      />

      {/* Location Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
            <LocateFixed className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{cityName}</p>
            <p className="text-xs text-muted-foreground">
              {locationStatus === "loading" && "Detecting location…"}
              {locationStatus === "granted" &&
                `Lat ${location?.lat.toFixed(2)}, Lng ${location?.lng.toFixed(2)}`}
              {locationStatus === "denied" &&
                "Using default city — enable location for accurate results"}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={requestLocation}
          disabled={locationStatus === "loading"}
          data-ocid="recommender.refresh_location_button"
        >
          <Navigation className="mr-1.5 h-3.5 w-3.5" />
          {locationStatus === "loading" ? "Locating…" : "Refresh Location"}
        </Button>
      </motion.div>

      {/* Gyms Section */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-semibold text-foreground">
            Nearby Gyms
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {gymsData.map((gym, i) => (
            <motion.div
              key={gym.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              data-ocid={`recommender.gym.item.${i + 1}`}
            >
              <GlassCard glow="cyan" className="flex h-full flex-col gap-4">
                <div
                  className={`flex h-24 items-center justify-center rounded-lg bg-gradient-to-br ${gym.imageGradient}`}
                >
                  <Dumbbell className="h-10 w-10 text-foreground/40" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-display font-semibold text-foreground">
                      {gym.name}
                    </h4>
                    <NeonBadge color={gym.open ? "green" : "orange"}>
                      {gym.open ? "Open" : "Closed"}
                    </NeonBadge>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <StarRating rating={gym.rating} />
                    <span className="text-xs text-muted-foreground">
                      ({gym.reviewCount})
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Navigation className="h-3 w-3" />
                    {gym.distance.toFixed(1)} mi
                    <span className="mx-1">·</span>
                    <Clock className="h-3 w-3" />
                    {gym.openHours}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {gym.amenities.map((a) => (
                      <NeonBadge key={a} color="cyan" className="gap-1">
                        <AmenityIcon amenity={a} />
                        {a}
                      </NeonBadge>
                    ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  data-ocid={`recommender.gym.view_button.${i + 1}`}
                >
                  View Details
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Workout Programs Section */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          <h3 className="font-display text-lg font-semibold text-foreground">
            Recommended Programs
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {workoutPrograms.map((program, i) => (
            <motion.div
              key={program.id}
              custom={i + 4}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              data-ocid={`recommender.program.item.${i + 1}`}
            >
              <GlassCard
                glow={program.color}
                className="flex h-full flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <DifficultyBadge level={program.difficulty} />
                  <span className="text-xs text-muted-foreground">
                    {program.duration}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-display font-semibold text-foreground">
                    {program.title}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {program.description}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Dumbbell className="h-3 w-3" />
                      {program.sessionsPerWeek}x / week
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {program.duration}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {program.tags.map((tag) => (
                      <NeonBadge key={tag} color={program.color}>
                        {tag}
                      </NeonBadge>
                    ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  data-ocid={`recommender.program.start_button.${i + 1}`}
                >
                  Start Program
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Fitness Challenges Section */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-chart-4" />
          <h3 className="font-display text-lg font-semibold text-foreground">
            Fitness Challenges
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fitnessChallenges.map((challenge, i) => {
            const isJoined = joinedChallenges.has(challenge.id);
            return (
              <motion.div
                key={challenge.id}
                custom={i + 8}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                data-ocid={`recommender.challenge.item.${i + 1}`}
              >
                <GlassCard
                  glow={challenge.color}
                  className="flex h-full flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Trophy className="h-6 w-6 text-chart-4" />
                    <NeonBadge color={isJoined ? "green" : "cyan"}>
                      {isJoined ? "Joined" : "Open"}
                    </NeonBadge>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display font-semibold text-foreground">
                      {challenge.title}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {challenge.description}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {challenge.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {challenge.participants.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-chart-4">
                      <ShieldCheck className="h-3 w-3" />
                      Reward: {challenge.reward}
                    </div>
                  </div>
                  <Button
                    variant={isJoined ? "secondary" : "default"}
                    size="sm"
                    className="w-full"
                    onClick={() => toggleChallenge(challenge.id)}
                    data-ocid={`recommender.challenge.join_button.${i + 1}`}
                  >
                    {isJoined ? (
                      <>
                        <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                        Joined
                      </>
                    ) : (
                      <>
                        <Zap className="mr-1.5 h-3.5 w-3.5" />
                        Join Challenge
                      </>
                    )}
                  </Button>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
