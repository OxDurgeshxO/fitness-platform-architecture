import { GlassCard } from "@/components/GlassCard";
import { NeonBadge } from "@/components/NeonBadge";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Beef,
  Calculator,
  Droplets,
  Dumbbell,
  Flame,
  Plus,
  Salad,
  Scale,
  Send,
  ShoppingCart,
  Target,
  Trash2,
  TrendingDown,
  Wheat,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface GroceryItem {
  id: number;
  name: string;
  checked: boolean;
}

interface MacroRingProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  icon: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "text-chart-4" };
  if (bmi < 25) return { label: "Healthy Weight", color: "text-chart-3" };
  if (bmi < 30) return { label: "Overweight", color: "text-chart-5" };
  return { label: "Obese", color: "text-destructive" };
}

function MacroRing({
  label,
  current,
  target,
  unit,
  color,
  icon,
}: MacroRingProps) {
  const pct = Math.min((current / target) * 100, 100);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center">
        <svg
          width="88"
          height="88"
          viewBox="0 0 88 88"
          className="-rotate-90"
          role="img"
          aria-label="Macro ring"
        >
          <circle
            cx="44"
            cy="44"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-muted/30"
          />
          <motion.circle
            cx="44"
            cy="44"
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-muted-foreground">{icon}</span>
          <span className="font-mono text-xs font-bold text-foreground">
            {Math.round(pct)}%
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="font-mono text-[10px] text-muted-foreground">
          {current.toLocaleString()}
          {unit} / {target.toLocaleString()}
          {unit}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Diet Plans Data                                                    */
/* ------------------------------------------------------------------ */

const dietPlans = [
  {
    id: "weight-loss",
    title: "Weight Loss Protocol",
    description:
      "Caloric deficit with high protein to preserve lean mass while shedding fat.",
    calories: 1800,
    protein: 160,
    carbs: 140,
    fat: 60,
    tag: "Weight Loss",
    badgeColor: "cyan" as const,
    icon: <TrendingDown className="h-5 w-5" />,
  },
  {
    id: "muscle-gain",
    title: "Hypertrophy Fuel",
    description:
      "Surplus calories with emphasis on protein and complex carbs for growth.",
    calories: 2800,
    protein: 200,
    carbs: 320,
    fat: 80,
    tag: "Muscle Gain",
    badgeColor: "purple" as const,
    icon: <Dumbbell className="h-5 w-5" />,
  },
  {
    id: "maintenance",
    title: "Maintenance Balance",
    description:
      "Sustainable macros to maintain current composition and energy levels.",
    calories: 2300,
    protein: 170,
    carbs: 240,
    fat: 70,
    tag: "Maintenance",
    badgeColor: "green" as const,
    icon: <Scale className="h-5 w-5" />,
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export function DieticianPage() {
  /* Chat */
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hello! I'm your AI Dietician. Tell me about your fitness goals and I'll create a personalized meal plan.",
    },
  ]);

  /* BMI Calculator */
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bmiResult, setBmiResult] = useState<number | null>(null);

  /* Grocery List */
  const [groceryInput, setGroceryInput] = useState("");
  const [groceries, setGroceries] = useState<GroceryItem[]>([
    { id: 1, name: "Chicken Breast", checked: false },
    { id: 2, name: "Brown Rice", checked: false },
    { id: 3, name: "Spinach", checked: false },
    { id: 4, name: "Greek Yogurt", checked: false },
    { id: 5, name: "Almonds", checked: false },
    { id: 6, name: "Salmon Fillets", checked: false },
  ]);

  /* Macros */
  const macros = {
    calories: { current: 1240, target: 2200 },
    protein: { current: 98, target: 160 },
    carbs: { current: 145, target: 250 },
    fat: { current: 42, target: 75 },
  };

  /* Handlers */
  function handleSend() {
    if (!message.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: message },
      {
        role: "assistant",
        text: "I've noted your query. Based on your profile, I recommend focusing on whole foods and consistent meal timing. Would you like a detailed breakdown?",
      },
    ]);
    setMessage("");
  }

  function calculateBMI() {
    const h = Number.parseFloat(height);
    const w = Number.parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return;
    const bmi = w / ((h / 100) * (h / 100));
    setBmiResult(Number.parseFloat(bmi.toFixed(1)));
  }

  function addGrocery() {
    if (!groceryInput.trim()) return;
    setGroceries((prev) => [
      ...prev,
      { id: Date.now(), name: groceryInput.trim(), checked: false },
    ]);
    setGroceryInput("");
  }

  function removeGrocery(id: number) {
    setGroceries((prev) => prev.filter((g) => g.id !== id));
  }

  function toggleGrocery(id: number) {
    setGroceries((prev) =>
      prev.map((g) => (g.id === id ? { ...g, checked: !g.checked } : g)),
    );
  }

  const bmiInfo = bmiResult ? getBmiCategory(bmiResult) : null;

  return (
    <div className="space-y-8">
      <SectionHeader
        title="AI Dietician & Calorie Coach"
        subtitle="Personalized nutrition plans, BMI analysis, and calorie tracking"
      />

      {/* Top Row: Chat + Macros */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <GlassCard glow="cyan" className="h-full">
            <div className="flex h-[420px] flex-col">
              <div className="flex-1 space-y-4 overflow-auto p-2">
                {chatMessages.map((msg, i) => (
                  <motion.div
                    key={`msg-${msg.role}-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20">
                        <Salad className="h-4 w-4 text-accent" />
                      </div>
                    )}
                    <div
                      className={`glass-panel max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.role === "user"
                          ? "rounded-tr-none bg-primary/20"
                          : "rounded-tl-none"
                      }`}
                    >
                      <p className="text-sm text-foreground">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Input
                  placeholder="Ask about meal plans, macros, or recipes..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1"
                  data-ocid="dietician.input"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  data-ocid="dietician.send_button"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Macro Rings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <GlassCard glow="purple" className="h-full">
            <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-foreground">
              <Target className="h-5 w-5 text-accent" />
              Today's Macros
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <MacroRing
                label="Calories"
                current={macros.calories.current}
                target={macros.calories.target}
                unit=""
                color="oklch(0.75 0.18 190)"
                icon={<Flame className="h-3 w-3" />}
              />
              <MacroRing
                label="Protein"
                current={macros.protein.current}
                target={macros.protein.target}
                unit="g"
                color="oklch(0.65 0.18 145)"
                icon={<Beef className="h-3 w-3" />}
              />
              <MacroRing
                label="Carbs"
                current={macros.carbs.current}
                target={macros.carbs.target}
                unit="g"
                color="oklch(0.75 0.15 85)"
                icon={<Wheat className="h-3 w-3" />}
              />
              <MacroRing
                label="Fat"
                current={macros.fat.current}
                target={macros.fat.target}
                unit="g"
                color="oklch(0.65 0.2 300)"
                icon={<Droplets className="h-3 w-3" />}
              />
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Middle Row: BMI Calculator + Grocery List */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* BMI Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <GlassCard glow="green">
            <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-foreground">
              <Calculator className="h-5 w-5 text-chart-3" />
              BMI Calculator
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="height" className="text-muted-foreground">
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  data-ocid="dietician.height_input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-muted-foreground">
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  data-ocid="dietician.weight_input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-muted-foreground">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="28"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  data-ocid="dietician.age_input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger data-ocid="dietician.gender_select">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              className="mt-4 w-full"
              onClick={calculateBMI}
              data-ocid="dietician.calculate_button"
            >
              Calculate BMI
            </Button>

            {bmiResult !== null && bmiInfo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 rounded-lg bg-muted/40 p-4 text-center"
              >
                <p className="text-sm text-muted-foreground">Your BMI</p>
                <p className="font-display text-3xl font-bold text-foreground">
                  {bmiResult}
                </p>
                <p className={`text-sm font-medium ${bmiInfo.color}`}>
                  {bmiInfo.label}
                </p>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>

        {/* Grocery List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <GlassCard>
            <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-foreground">
              <ShoppingCart className="h-5 w-5 text-chart-4" />
              Grocery List
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="Add item..."
                value={groceryInput}
                onChange={(e) => setGroceryInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addGrocery()}
                data-ocid="dietician.grocery_input"
              />
              <Button
                size="icon"
                onClick={addGrocery}
                data-ocid="dietician.add_grocery_button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 max-h-[260px] space-y-2 overflow-auto">
              {groceries.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No items yet. Add groceries above.
                </p>
              )}
              {groceries.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 rounded-md bg-muted/30 px-3 py-2"
                >
                  <button
                    type="button"
                    onClick={() => toggleGrocery(item.id)}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                      item.checked
                        ? "border-chart-3 bg-chart-3 text-primary-foreground"
                        : "border-input"
                    }`}
                    data-ocid={`dietician.grocery_checkbox.${item.id}`}
                  >
                    {item.checked && (
                      <svg
                        role="img"
                        aria-label="Checked"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                  <span
                    className={`flex-1 text-sm ${
                      item.checked
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    }`}
                  >
                    {item.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeGrocery(item.id)}
                    data-ocid={`dietician.delete_grocery_button.${item.id}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Bottom Row: Diet Plan Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
          Recommended Diet Plans
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dietPlans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
            >
              <GlassCard glow={plan.badgeColor} hover className="h-full">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
                    {plan.icon}
                  </div>
                  <NeonBadge color={plan.badgeColor}>{plan.tag}</NeonBadge>
                </div>
                <h4 className="mt-3 font-display font-semibold text-foreground">
                  {plan.title}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md bg-muted/30 px-2 py-1.5 text-center">
                    <span className="block font-mono font-bold text-foreground">
                      {plan.calories.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">kcal</span>
                  </div>
                  <div className="rounded-md bg-muted/30 px-2 py-1.5 text-center">
                    <span className="block font-mono font-bold text-chart-3">
                      {plan.protein}g
                    </span>
                    <span className="text-muted-foreground">protein</span>
                  </div>
                  <div className="rounded-md bg-muted/30 px-2 py-1.5 text-center">
                    <span className="block font-mono font-bold text-chart-4">
                      {plan.carbs}g
                    </span>
                    <span className="text-muted-foreground">carbs</span>
                  </div>
                  <div className="rounded-md bg-muted/30 px-2 py-1.5 text-center">
                    <span className="block font-mono font-bold text-accent">
                      {plan.fat}g
                    </span>
                    <span className="text-muted-foreground">fat</span>
                  </div>
                </div>
                <Button
                  className="mt-4 w-full"
                  variant="outline"
                  data-ocid={`dietician.plan_select_button.${plan.id}`}
                >
                  Select Plan
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
