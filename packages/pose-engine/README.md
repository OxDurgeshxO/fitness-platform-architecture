# @oxdurgesh/pose-fsm

> Headless 3D joint kinematics, biomechanical knee valgus detection, and hysteresis repetition counter finite state machine (FSM) engine. Zero DOM and zero browser dependencies.

## Installation

```bash
npm install @oxdurgesh/pose-fsm
```

## Quick Start

```typescript
import { calculateJointAngle, RepCounter, calculateKneeValgus } from "@oxdurgesh/pose-fsm";

// 1. Calculate 3D joint angle (e.g. knee flexion during squat)
const hip = { x: 0.5, y: 0.3, z: 0.1 };
const knee = { x: 0.5, y: 0.6, z: 0.2 };
const ankle = { x: 0.5, y: 0.9, z: 0.1 };

const kneeAngle = calculateJointAngle(hip, knee, ankle);
console.log(`Knee Flexion: ${kneeAngle} deg`);

// 2. Repetition Counter State Machine
const counter = new RepCounter(160, 90); // UP at 160°, DOWN at 90°
counter.update(85);  // Transition to DOWN
counter.update(165); // Transition to UP -> rep count = 1
console.log(`Completed Reps: ${counter.getCount()}`);

// 3. Biomechanical Form Check (Knee Valgus / Inward Cave)
const valgus = calculateKneeValgus(hip, knee, ankle);
if (valgus.isValgusCollapse) {
  console.warn(valgus.feedback);
}
```

## License
MIT © Durgesh (OxDurgeshxO)
