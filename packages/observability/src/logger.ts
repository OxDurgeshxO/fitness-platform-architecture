export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

export class StructuredLogger {
  private service: string;

  constructor(service: string = "fitness-platform") {
    this.service = service;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const entry = {
      timestamp: new Date().toISOString(),
      service: this.service,
      level,
      message,
      pid: process.pid,
      ...context
    };
    const out = JSON.stringify(entry) + "\n";
    if (level === "ERROR") {
      process.stderr.write(out);
    } else {
      process.stdout.write(out);
    }
  }

  public debug(msg: string, ctx?: Record<string, unknown>) { this.log("DEBUG", msg, ctx); }
  public info(msg: string, ctx?: Record<string, unknown>) { this.log("INFO", msg, ctx); }
  public warn(msg: string, ctx?: Record<string, unknown>) { this.log("WARN", msg, ctx); }
  public error(msg: string, ctx?: Record<string, unknown>) { this.log("ERROR", msg, ctx); }
}

export const logger = new StructuredLogger();
