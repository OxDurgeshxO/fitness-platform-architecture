# AI / ML GUIDELINES

## Every AI Module Must Include

1. **Architecture** — model selection rationale
2. **Training Pipeline** — data ingestion → preprocessing → training → evaluation
3. **Model Evaluation** — metrics, benchmarks, baselines
4. **Inference Service** — latency targets, batching strategy
5. **Optimization** — quantization, ONNX export, TensorRT where applicable
6. **Monitoring** — drift detection, accuracy degradation alerts
7. **Deployment** — containerized, versioned model registry
8. **Fallback Strategy** — rule-based fallback when model is unavailable
9. **Failure Recovery** — retry logic, circuit breakers

## Computer Vision Stack

| Use Case | Preferred Model |
|---|---|
| Real-time pose estimation | MediaPipe Pose / MoveNet Lightning |
| Offline / high-accuracy | OpenPose / MoveNet Thunder |
| Object/exercise detection | YOLOv8 |
| Custom exercise classification | PyTorch CNN / Transformer fine-tune |

## CV Feature Requirements

- Joint Angle Analysis
- Rep Counting (state machine approach)
- Form Correction (deviation scoring)
- Skeleton Tracking (temporal smoothing)
- Performance Scoring (per-rep quality score)
- Motion Analysis (velocity, acceleration)
- Symmetry Analysis (left/right body balance)

## LLM Agent Rules

- Use **structured output** (JSON mode) for all LLM responses consumed by the system
- Implement **prompt versioning** — never hardcode prompts in application code
- Store prompts in the database or config; load at runtime
- Evaluate prompts with regression test suites before deployment
- Apply **guardrails** — content filtering, hallucination detection, confidence thresholds

## Voice Assistant

- STT: OpenAI Whisper (self-hosted or API)
- TTS: ElevenLabs / Azure Cognitive / Coqui TTS
- Intent classification: Fine-tuned classifier or LLM-based routing
- Latency target: < 800ms end-to-end for voice responses
