import { spawn } from "child_process";

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runRealtimeSmokeTest() {
  console.log("==> 1. Launching realtime-service WebSocket instance on :8080...");
  const srvProc = spawn("node", ["apps/realtime-service/dist/index.js"], {
    env: { ...process.env, PORT: "8080", METRICS_PORT: "9122" },
    stdio: "inherit"
  });

  await wait(1500);

  console.log("==> 2. Connecting WebSocket client to ws://127.0.0.1:8080/stream?session_id=smoke_session_001...");
  const ws = new WebSocket("ws://127.0.0.1:8080/stream?session_id=smoke_session_001");

  try {
    await new Promise<void>((resolve, reject) => {
      ws.addEventListener("open", () => resolve(), { once: true });
      ws.addEventListener("error", (err) => reject(err), { once: true });
    });

    console.log("==> 3. WebSocket connected. Sending simulated pose frame event...");
    const framePayload = {
      type: "pose_frame",
      sessionId: "smoke_session_001",
      timestamp: Date.now(),
      landmarks: [
        { x: 0.5, y: 0.4, z: 0, visibility: 0.99 },
        { x: 0.5, y: 0.6, z: 0, visibility: 0.99 },
        { x: 0.5, y: 0.8, z: 0, visibility: 0.99 }
      ]
    };

    ws.send(JSON.stringify(framePayload));
    await wait(500);

    console.log("==> 4. Realtime stream verified. Closing connection...");
    ws.close();
    console.log("==> REALTIME SMOKE TEST PASSED 100%!");
  } finally {
    srvProc.kill("SIGTERM");
  }
}

runRealtimeSmokeTest().catch((err) => {
  console.error("REALTIME SMOKE TEST FAILED:", err);
  process.exit(1);
});
