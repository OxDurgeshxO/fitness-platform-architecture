import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { WorkoutSessionManager } from "@fitness/core";
import { SquatKeypoints } from "@fitness/cv";

const PORT = parseInt(process.env.REALTIME_PORT || "8080", 10);

const server = http.createServer((req, res) => {
  if (req.url === "/healthz" || req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "healthy", service: "realtime-service", timestamp: new Date().toISOString() }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket) => {
  let sessionManager: WorkoutSessionManager | null = null;

  ws.on("message", async (data: Buffer | string) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === "start_session") {
        const userId = message.userId || "guest_athlete";
        sessionManager = new WorkoutSessionManager(userId, "squat");
        ws.send(JSON.stringify({
          type: "session_started",
          sessionId: sessionManager.getSession().id
        }));
      } else if (message.type === "pose_frame" && sessionManager) {
        const keypoints = message.keypoints as SquatKeypoints;
        const timestampMs = message.timestampMs || Date.now();

        const result = await sessionManager.processPoseFrame(keypoints, timestampMs);

        ws.send(JSON.stringify({
          type: "pose_telemetry",
          repCount: result.repCount,
          newIssue: result.newIssue,
          completedRep: result.completedRep,
          feedback: result.feedback
        }));
      } else if (message.type === "end_session" && sessionManager) {
        const summary = sessionManager.completeSession();
        ws.send(JSON.stringify({
          type: "session_completed",
          summary
        }));
        sessionManager = null;
      }
    } catch (err: any) {
      ws.send(JSON.stringify({ type: "error", message: err.message }));
    }
  });

  ws.on("close", () => {
    if (sessionManager) {
      sessionManager.completeSession();
    }
  });
});

server.listen(PORT, () => {
  console.log(`⚡ Realtime WebSocket pose-feedback service running on port ${PORT}`);
});
